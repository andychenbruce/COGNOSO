pub mod database;

use crate::AndyError;
use http_body_util::BodyExt;
use http_body_util::Full;
use hyper::body::Buf;
use hyper::body::Bytes;
use hyper::{Request, Response};

#[derive(Clone)]
pub struct SharedState {
    pub database: std::sync::Arc<std::sync::Mutex<database::Database>>,
}

pub async fn main_service(
    req: Request<hyper::body::Incoming>,
    state: SharedState,
) -> Result<Response<Full<Bytes>>, AndyError> {
    let uri = req.uri().path();
    let method = req.method();

    macro_rules! endpoints {
        ($(($meth:pat, $uri:pat, $func:expr)),*) => {
            match (method, uri) {
                $((&$meth, $uri) => {
                    let bytes = req.collect().await?.to_bytes();
                    let thing = serde_json::from_reader(bytes.reader())?;
                    $func(thing, state).await
                },)*
                (method, endpoint) => {
                    println!("BAD REQUEST IDK: endpoint = {}, meth = {}", endpoint, method);
                    let mut not_found = Response::new(Full::new(Bytes::from("")));
                    *not_found.status_mut() = hyper::StatusCode::NOT_FOUND;
                    Ok(not_found)
                }
            }
        }
    }

    endpoints!(
        (
            hyper::Method::POST,
            api_structs::ENDPOINT_CREATE_CARD_DECK,
            create_card_deck
        ),
        (
            hyper::Method::POST,
            api_structs::ENDPOINT_CREATE_CARD,
            create_card
        ),
        (
            hyper::Method::POST,
            api_structs::ENDPOINT_NEW_USER,
            new_user
        )
    )
}

async fn create_card_deck(
    info: api_structs::CreateCardDeck,
    state: SharedState,
) -> Result<Response<Full<Bytes>>, AndyError> {
    state.database.lock().unwrap().new_card_deck(info)?;
    Ok(Response::new(Full::new(Bytes::from(""))))
}

async fn create_card(
    info: api_structs::CreateCard,
    state: SharedState,
) -> Result<Response<Full<Bytes>>, AndyError> {
    state.database.lock().unwrap().new_card(info)?;
    Ok(Response::new(Full::new(Bytes::from(""))))
}

async fn new_user(
    info: api_structs::NewUser,
    state: SharedState,
) -> Result<Response<Full<Bytes>>, AndyError> {
    state.database.lock().unwrap().new_user(info)?;
    Ok(Response::new(Full::new(Bytes::from(""))))
}
