use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[arg(long)]
    pub port: u16,

    #[arg(long)]
    pub database_path: std::path::PathBuf,

    #[arg(long)]
    pub llm_runner: std::net::SocketAddr,

    #[arg(long)]
    pub qdrant_addr: Option<String>,

    #[arg(long)]
    pub embedder_path: Option<std::path::PathBuf>,
}
