pub mod database;

use crate::AndyError;
use http_body_util::BodyExt;
use http_body_util::Full;
use hyper::body::Buf;
use hyper::body::Bytes;
use hyper::{Request, Response};

pub struct SharedState {
    pub database: database::Database,
}

pub async fn main_service(
    req: Request<hyper::body::Incoming>,
    state: std::sync::Arc<SharedState>,
) -> Result<Response<Full<Bytes>>, std::convert::Infallible> {
    match handle_request(req, state).await {
        Ok(x) => Ok(x),
        Err(e) => {
            println!("got error: {:?}", e);
            let mut err_response = Response::new(Full::new(Bytes::from(format!("{:?}", e))));
            *err_response.status_mut() = hyper::StatusCode::INTERNAL_SERVER_ERROR;

            Ok(err_response)
        }
    }
}

pub async fn cors_preflight_headers(
    _req: Request<hyper::body::Incoming>,
    methods: Vec<&str>,
) -> Result<Response<Full<Bytes>>, AndyError> {
    let builder_no_headers = hyper::Response::builder()
        .status(hyper::StatusCode::OK)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "content-type");

    Ok(methods
        .into_iter()
        .fold(builder_no_headers, |acc, x| {
            acc.header("Access-Control-Allow-Methods", x)
        })
        .body("".into())?)
}

async fn handle_request(
    req: Request<hyper::body::Incoming>,
    state: std::sync::Arc<SharedState>,
) -> Result<Response<Full<Bytes>>, AndyError> {
    let uri = req.uri().path();
    let method = req.method();

    macro_rules! endpoints {
        ($(($meth:pat, $uri:pat, $func:expr)),*) => {
            match (method, uri) {
                $((&$meth, $uri) => {
                    let bytes = req.collect().await?.to_bytes();
                    let thing = serde_json::from_reader(bytes.reader())?;
                    let body_struct = $func(thing, state).await?;
                    let body_str = serde_json::to_string(&body_struct)?;
                    Ok(hyper::Response::builder()
                        .status(hyper::StatusCode::OK)
                        .header("content-type", "application/json")
                        .header("Access-Control-Allow-Origin", "*")
                        .body(Full::new(Bytes::from(body_str)))?)
                },)*
                (&hyper::Method::OPTIONS, _) => {//TODO this handles POST requests in CORS headers
                    cors_preflight_headers(req, vec!("POST")).await
                },
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
        ),
        (
            hyper::Method::POST,
            api_structs::ENDPOINT_LIST_CARD_DECKS,
            list_card_decks
        ),
        (
            hyper::Method::POST,
            api_structs::ENDPOINT_LIST_CARDS,
            list_cards
        )
    )
}


async fn login(
    _info: api_structs::LoginRequest,
    _state: std::sync::Arc<SharedState>,
) -> Result<api_structs::LoginResponse, AndyError> {
    todo!()
    //state.database.new_thingidk(info)?;
}


async fn create_card_deck(
    info: api_structs::CreateCardDeck,
    state: std::sync::Arc<SharedState>,
) -> Result<(), AndyError> {
    state.database.new_card_deck(info)?;
    Ok(())
}

async fn create_card(
    info: api_structs::CreateCard,
    state: std::sync::Arc<SharedState>,
) -> Result<(), AndyError> {
    state.database.new_card(info)?;
    Ok(())
}

async fn new_user(
    info: api_structs::NewUser,
    state: std::sync::Arc<SharedState>,
) -> Result<(), AndyError> {
    state.database.new_user(info)?;
    Ok(())
}

async fn list_card_decks(
    info: api_structs::ListCardDecks,
    state: std::sync::Arc<SharedState>,
) -> Result<api_structs::ListCardDecksResponse, AndyError> {
    state.database.list_card_decks(info)
}

async fn list_cards(
    info: api_structs::ListCards,
    state: std::sync::Arc<SharedState>,
) -> Result<api_structs::ListCardsResponse, AndyError> {
    state.database.list_cards(info)
}
