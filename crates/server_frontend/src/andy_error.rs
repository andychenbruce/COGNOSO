#[derive(thiserror::Error, Debug)]
pub enum AndyError {
    #[error("hyper library http error")]
    HyperHttp(#[from] hyper::http::Error),
    #[error("hyper library error")]
    Hyper(#[from] hyper::Error),
    #[error("file error")]
    IO(#[from] std::io::Error),
    #[error("uri path not unicode")]
    BadUriPath,
}
