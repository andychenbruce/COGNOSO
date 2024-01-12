use clap::Parser;

#[derive(Parser)]
pub struct AndyArgs {
    #[arg(long)]
    pub port: u16,

    #[arg(long)]
    pub root_serve_path: std::path::PathBuf,
}
