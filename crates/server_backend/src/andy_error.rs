#[derive(thiserror::Error, Debug)]
pub enum AndyError {
    #[error("hyper library error")]
    Hyper(#[from] hyper::Error),
    #[error("serde json (de)serialization error")]
    Serde(#[from] serde_json::Error),
    #[error("io error")]
    Io(#[from] std::io::Error),
    //#[error("nonexistant user")]
    //UserDoesNotExist,
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
    #[error("int cast err")]
    UnknownError(Box<dyn std::error::Error>),
}

impl<T: 'static> From<std::sync::PoisonError<T>> for AndyError {
    fn from(thing: std::sync::PoisonError<T>) -> Self {
        AndyError::UnknownError(Box::new(thing))
    }
}
