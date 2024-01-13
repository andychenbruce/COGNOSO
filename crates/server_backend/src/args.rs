use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[arg(long)]
    pub port: u16,

    #[arg(long)]
    pub database_path: std::path::PathBuf,
}

