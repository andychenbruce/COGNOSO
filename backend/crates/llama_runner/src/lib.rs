mod token_output_stream;

use std::io::Write;
use tokenizers::Tokenizer;

use candle_core::quantized::gguf_file;
use candle_core::Tensor;
use candle_transformers::generation::LogitsProcessor;

use candle_transformers::models::quantized_llama as model;
use model::ModelWeights;
use token_output_stream::TokenOutputStream;

const VERBOSE_PROMPT: bool = false;
const SAMPLE_LEN: usize = 3;
const SEED: u64 = 5;
const TOP_P: Option<f64> = None;

pub struct ModelOptions {
    temperature: Option<f64>,
    repeat_penalty: f32,
    repeat_last_n: usize,
}

pub struct AndyModel {
    device: candle_core::Device,
    weights: ModelWeights,
    tokenizer: Tokenizer,
    temperature: Option<f64>,
    repeat_penalty: f32,
    repeat_last_n: usize
}

impl AndyModel {
    pub fn new(options: ModelOptions) -> candle_core::Result<Self> {
        println!(
            "avx: {}, neon: {}, simd128: {}, f16c: {}",
            candle_core::utils::with_avx(),
            candle_core::utils::with_neon(),
            candle_core::utils::with_simd128(),
            candle_core::utils::with_f16c()
        );
        println!(
            "temp: {:?} repeat-penalty: {} repeat-last-n: {}",
            options.temperature, options.repeat_penalty, options.repeat_last_n
        );

        let model_path: std::path::PathBuf = "bruh.gguf".to_owned().into();
        let mut file = std::fs::File::open(&model_path)?;
        let start = std::time::Instant::now();
        let device = candle_core::Device::new_cuda(0)?;

        let model = match model_path.extension().and_then(|v| v.to_str()) {
            Some("gguf") => {
                let model =
                    gguf_file::Content::read(&mut file).map_err(|e| e.with_path(model_path))?;
                let mut total_size_in_bytes = 0;
                for (_, tensor) in model.tensor_infos.iter() {
                    let elem_count = tensor.shape.elem_count();
                    total_size_in_bytes +=
                        elem_count * tensor.ggml_dtype.type_size() / tensor.ggml_dtype.block_size();
                }
                println!(
                    "loaded {:?} tensors ({}) in {:.2}s",
                    model.tensor_infos.len(),
                    total_size_in_bytes,
                    start.elapsed().as_secs_f32(),
                );
                ModelWeights::from_gguf(model, &mut file, &device)?
            }
            _ => {
                todo!()
            }
        };

        println!("model built");


        let tokenizer = Tokenizer::from_file("tokenizer.txt.idk.lol").unwrap();


        
        Ok(Self { weights: model,
            tokenizer, device,
            repeat_last_n: options.repeat_last_n,
            repeat_penalty: options.repeat_penalty,
            temperature: options.temperature
            
        })
    }

    pub fn run(&mut self) -> candle_core::Result<()>{
        

        let mut tos = TokenOutputStream::new(self.tokenizer.clone());

        let mut pre_prompt_tokens = vec![];
        for _prompt_index in 0.. {
            let prompt_str = {
                //let is_interactive = matches!(prompt, Prompt::Interactive);
                print!("> ");
                std::io::stdout().flush()?;
                let mut prompt = String::new();
                std::io::stdin().read_line(&mut prompt)?;
                if prompt.ends_with('\n') {
                    prompt.pop();
                    if prompt.ends_with('\r') {
                        prompt.pop();
                    }
                }
                //adjust idk
                format!("<|system|>\n</s>\n<|user|>\n{prompt}</s>\n<|assistant|>",)
            };
            print!("{}", &prompt_str);
            let tokens = tos
                .tokenizer()
                .encode(prompt_str, true).unwrap();
            if VERBOSE_PROMPT {
                for (token, id) in tokens.get_tokens().iter().zip(tokens.get_ids().iter()) {
                    let token = token.replace('▁', " ").replace("<0x0A>", "\n");
                    println!("{id:7} -> '{token}'");
                }
            }

            let prompt_tokens = [&pre_prompt_tokens, tokens.get_ids()].concat();
            let to_sample = SAMPLE_LEN.saturating_sub(1);
            let prompt_tokens = if prompt_tokens.len() + to_sample > model::MAX_SEQ_LEN - 10 {
                let to_remove = prompt_tokens.len() + to_sample + 10 - model::MAX_SEQ_LEN;
                prompt_tokens[prompt_tokens.len().saturating_sub(to_remove)..].to_vec()
            } else {
                prompt_tokens
            };
            let mut all_tokens = vec![];
            let mut logits_processor = LogitsProcessor::new(SEED, self.temperature, TOP_P);

            let start_prompt_processing = std::time::Instant::now();
            let mut next_token = {
                let input = Tensor::new(prompt_tokens.as_slice(), &self.device)?.unsqueeze(0)?;
                let logits = self.weights.forward(&input, 0)?;
                let logits = logits.squeeze(0)?;
                logits_processor.sample(&logits)?
            };
            let prompt_dt = start_prompt_processing.elapsed();
            all_tokens.push(next_token);
            if let Some(t) = tos.next_token(next_token)? {
                print!("{t}");
                std::io::stdout().flush()?;
            }

            let eos_token = "</s>";
            let eos_token = *tos.tokenizer().get_vocab(true).get(eos_token).unwrap();
            let start_post_prompt = std::time::Instant::now();
            let mut sampled = 0;
            for index in 0..to_sample {
                let input = Tensor::new(&[next_token], &self.device)?.unsqueeze(0)?;
                let logits = self.weights.forward(&input, prompt_tokens.len() + index)?;
                let logits = logits.squeeze(0)?;
                let logits = if self.repeat_penalty == 1. {
                    logits
                } else {
                    let start_at = all_tokens.len().saturating_sub(self.repeat_last_n);
                    candle_transformers::utils::apply_repeat_penalty(
                        &logits,
                        self.repeat_penalty,
                        &all_tokens[start_at..],
                    )?
                };
                next_token = logits_processor.sample(&logits)?;
                all_tokens.push(next_token);
                if let Some(t) = tos.next_token(next_token)? {
                    print!("{t}");
                    std::io::stdout().flush()?;
                }
                sampled += 1;
                if next_token == eos_token {
                    break;
                };
            }
            if let Some(rest) = tos.decode_rest().map_err(candle_core::Error::msg)? {
                print!("{rest}");
            }
            std::io::stdout().flush()?;
            let dt = start_post_prompt.elapsed();
            println!(
                "\n\n{:4} prompt tokens processed: {:.2} token/s",
                prompt_tokens.len(),
                prompt_tokens.len() as f64 / prompt_dt.as_secs_f64(),
            );
            println!(
                "{sampled:4} tokens generated: {:.2} token/s",
                sampled as f64 / dt.as_secs_f64(),
            );

            pre_prompt_tokens = [prompt_tokens.as_slice(), all_tokens.as_slice()].concat()

        }
        Ok(())
    }
}


