use candle_core::Tensor;
use candle_nn::VarBuilder;
use candle_transformers::models::bert::{BertModel, Config, HiddenAct, DTYPE};
use tokenizers::{PaddingParams, Tokenizer};

const APPROXIMAGE_GELU: bool = true;
const NORMALIZE: bool = true;

#[derive(thiserror::Error, Debug)]
pub enum EmbedderError {
    #[error("candle error")]
    Candle(#[from] candle_core::Error),
    #[error("serde error")]
    Serde(#[from] serde_json::Error),
    #[error("io error")]
    Io(#[from] std::io::Error),
    #[error("tokenizer error")]
    Tokenizer(std::boxed::Box<dyn std::error::Error + std::marker::Send + std::marker::Sync>),
}

pub struct SentenceEmbedder {
    model: BertModel,
    tokenizer: Tokenizer,
    device: candle_core::Device,
}

impl SentenceEmbedder {
    pub fn new(path: &std::path::Path) -> Result<Self, EmbedderError> {
        let device = candle_core::Device::new_cuda(0)?;

        let config_filename = path.join("config.json");
        //let weights_filename = path.join("model.safetensors");
        let weights_filename = path.join("pytorch_model.bin");
        let tokenizer_filename = path.join("tokenizer.json");

        let config = std::fs::read_to_string(config_filename)?;
        let mut config: Config = serde_json::from_str(&config)?;
        let tokenizer =
            Tokenizer::from_file(tokenizer_filename).map_err(EmbedderError::Tokenizer)?;

        // let vb =
        //     unsafe { VarBuilder::from_mmaped_safetensors(&[weights_filename], DTYPE, &device)? };

        let vb = VarBuilder::from_pth(&weights_filename, DTYPE, &device)?;

        if APPROXIMAGE_GELU {
            config.hidden_act = HiddenAct::GeluApproximate;
        }

        let model = BertModel::load(vb, &config)?;

        Ok(SentenceEmbedder {
            model,
            tokenizer,
            device,
        })
    }

    pub fn run(&mut self, sentences: Vec<String>) -> Result<Vec<Vec<f32>>, EmbedderError> {
        let n_sentences = sentences.len();
        if let Some(pp) = self.tokenizer.get_padding_mut() {
            pp.strategy = tokenizers::PaddingStrategy::BatchLongest
        } else {
            let pp = PaddingParams {
                strategy: tokenizers::PaddingStrategy::BatchLongest,
                ..Default::default()
            };
            self.tokenizer.with_padding(Some(pp));
        }
        let tokens = self
            .tokenizer
            .encode_batch(sentences.to_vec(), true)
            .map_err(EmbedderError::Tokenizer)?;
        let token_ids = tokens
            .iter()
            .map(|tokens| {
                let tokens = tokens.get_ids().to_vec();
                Tensor::new(tokens.as_slice(), &self.device)
            })
            .collect::<Result<Vec<_>, candle_core::Error>>()?;

        let token_ids = Tensor::stack(&token_ids, 0)?;
        let token_type_ids = token_ids.zeros_like()?;
        let embeddings = self.model.forward(&token_ids, &token_type_ids)?;

        // Apply some avg-pooling by taking the mean embedding value for all tokens (including padding)
        let (_n_sentence, n_tokens, _hidden_size) = embeddings.dims3()?;
        let embeddings = (embeddings.sum(1)? / (n_tokens as f64))?;
        let embeddings = if NORMALIZE {
            normalize_l2(&embeddings)?
        } else {
            embeddings
        };

        let embeddings_list: Vec<Vec<f32>> = (0..n_sentences)
            .map(|i| Ok(embeddings.get(i)?.to_vec1::<f32>()?))
            .collect::<Result<_, EmbedderError>>()?;

        Ok(embeddings_list)
    }
}

fn normalize_l2(v: &Tensor) -> Result<Tensor, EmbedderError> {
    Ok(v.broadcast_div(&v.sqr()?.sum_keepdim(1)?.sqrt()?)?)
}
