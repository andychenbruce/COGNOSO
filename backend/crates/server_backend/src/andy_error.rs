#[derive(thiserror::Error, Debug)]
pub enum AndyError {
    #[error("hyper library error")]
    Hyper(#[from] hyper::Error),
    #[error("serde json (de)serialization error")]
    Serde(#[from] serde_json::Error),
    #[error("io error")]
    Io(#[from] std::io::Error),
    #[error("nonexistant user")]
    UserDoesNotExist,
    #[error("deck does not exist")]
    DeckDoesNotExist,
    #[error("card index not valid")]
    CardIndexOutOfBounds,
    #[error("wrong password")]
    WrongPassword,
    #[error("bad access token")]
    BadAccessToken,
    #[error("database err")]
    DbError(#[from] redb::DatabaseError),
    #[error("database transaction err")]
    DbTransaction(#[from] redb::TransactionError),
    #[error("database table err")]
    DbTable(#[from] redb::TableError),
    #[error("database storage err")]
    DbStorage(#[from] redb::StorageError),
    #[error("database commit err")]
    DbCommit(#[from] redb::CommitError),
    #[error("int cast err")]
    IntCast(#[from] core::num::TryFromIntError),
    #[error("http err")]
    HttpError(#[from] hyper::http::Error),
    #[error("http invalid header")]
    HttpInvalidHeader(#[from] hyper::header::InvalidHeaderValue),
    #[error("invalid hash in database")]
    BadHash(Vec<u8>),
    #[error("pdf err")]
    Pdf(#[from] pdf_parser::AndyPdfError),
    #[error("llm err")]
    Llm(#[from] crate::server::llm::LlmError),
}
