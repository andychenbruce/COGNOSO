use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[arg(long)]
    pub port: u16,

    #[arg(long)]
    pub database_path: std::path::PathBuf,

    #[arg(long)]
    pub model_path: std::path::PathBuf,
    #[arg(long)]
    pub tokenizer_path: std::path::PathBuf,
}
