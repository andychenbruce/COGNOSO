use candle_core::Tensor;
use candle_nn::VarBuilder;
use candle_transformers::models::bert::{BertModel, Config, HiddenAct, DTYPE};
use tokenizers::{PaddingParams, Tokenizer};

const APPROXIMAGE_GELU: bool = true;
const NORMALIZE: bool = true;

pub type EmbedderError = candle_core::Error;

pub struct SentenceEmbedder {
    model: BertModel,
    tokenizer: Tokenizer,
    device: candle_core::Device,
}

impl SentenceEmbedder {
    pub fn new(path: &std::path::Path) -> Result<Self, EmbedderError> {
        let device = candle_core::Device::Cpu; //change to cuda later

        let config_filename = path.join("config.json");
        //let weights_filename = path.join("model.safetensors");
        let weights_filename = path.join("pytorch_model.bin");
        let tokenizer_filename = path.join("tokenizer.json");

        let config = std::fs::read_to_string(config_filename)?;
        let mut config: Config = serde_json::from_str(&config).unwrap();
        let tokenizer = Tokenizer::from_file(tokenizer_filename).unwrap();

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
            .unwrap();
        let token_ids = tokens
            .iter()
            .map(|tokens| {
                let tokens = tokens.get_ids().to_vec();
                Tensor::new(tokens.as_slice(), &self.device)
            })
            .collect::<Result<Vec<_>, EmbedderError>>()?;

        let token_ids = Tensor::stack(&token_ids, 0)?;
        let token_type_ids = token_ids.zeros_like()?;
        println!("running inference on batch {:?}", token_ids.shape());
        let embeddings = self.model.forward(&token_ids, &token_type_ids)?;
        println!("generated embeddings {:?}", embeddings.shape());
        // Apply some avg-pooling by taking the mean embedding value for all tokens (including padding)
        let (_n_sentence, n_tokens, _hidden_size) = embeddings.dims3()?;
        let embeddings = (embeddings.sum(1)? / (n_tokens as f64))?;
        let embeddings = if NORMALIZE {
            normalize_l2(&embeddings)?
        } else {
            embeddings
        };
        println!("pooled embeddings {:?}", embeddings.shape());

        let mut similarities = vec![];
        for i in 0..n_sentences {
            let e_i = embeddings.get(i)?;
            for j in (i + 1)..n_sentences {
                let e_j = embeddings.get(j)?;
                let sum_ij = (&e_i * &e_j)?.sum_all()?.to_scalar::<f32>()?;
                let sum_i2 = (&e_i * &e_i)?.sum_all()?.to_scalar::<f32>()?;
                let sum_j2 = (&e_j * &e_j)?.sum_all()?.to_scalar::<f32>()?;
                let cosine_similarity = sum_ij / (sum_i2 * sum_j2).sqrt();
                similarities.push((cosine_similarity, i, j))
            }
        }
        similarities.sort_by(|u, v| v.0.total_cmp(&u.0));
        for &(score, i, j) in similarities[..5].iter() {
            println!("score: {score:.2} '{}' '{}'", sentences[i], sentences[j])
        }

        todo!()
    }
}

fn normalize_l2(v: &Tensor) -> Result<Tensor, EmbedderError> {
    v.broadcast_div(&v.sqr()?.sum_keepdim(1)?.sqrt()?)
}
