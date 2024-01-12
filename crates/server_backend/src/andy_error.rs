#[derive(thiserror::Error, Debug)]
pub enum AndyError {
    #[error("hyper library error")]
    Hyper(#[from] hyper::Error),
    #[error("serde json (de)serialization error")]
    Serde(#[from] serde_json::Error),
    #[error("io error")]
    Io(#[from] std::io::Error),
}
