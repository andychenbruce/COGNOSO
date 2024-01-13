pub mod database;

use crate::AndyError;
use http_body_util::BodyExt;
use http_body_util::Full;
use hyper::body::Buf;
use hyper::body::Bytes;
use hyper::{Request, Response};

#[derive(Clone)]
pub struct SharedState {
    pub database: std::sync::Arc<std::sync::Mutex<database::Database>>
}

pub async fn main_service(
    req: Request<hyper::body::Incoming>,
    state: SharedState,
) -> Result<Response<Full<Bytes>>, AndyError> {
    let uri = req.uri().path();
    let method = req.method();

    macro_rules! endpoints {
        ($(($meth:pat, $uri:expr, $func:expr)),*) => {
            match (method, uri) {
                $((&$meth, $uri) => {
                    let bytes = req.collect().await?.to_bytes();
                    let thing = serde_json::from_reader(bytes.reader())?;
                    $func(thing, state).await
                },)*
                _ => {
                    let mut not_found = Response::new(Full::new(Bytes::from("")));
                    *not_found.status_mut() = hyper::StatusCode::NOT_FOUND;
                    Ok(not_found)
                }
            }
        }
    }

    endpoints!(
        (hyper::Method::POST, "/create_card_deck", create_card_deck),
        (hyper::Method::POST, "/create_card", create_card)
    )
}

async fn create_card_deck(
    info: api_structs::CreateCardDeck,
    state: SharedState
) -> Result<Response<Full<Bytes>>, AndyError> {
    state.database.lock().unwrap().new_card_deck(info)?;


    todo!()
}

async fn create_card(
    info: api_structs::CreateCard,
    state: SharedState
) -> Result<Response<Full<Bytes>>, AndyError> {
    state.database.lock().unwrap().new_card(info)?;
    todo!()
}
