mod andy_error;

use hyper::body::Buf;

use andy_error::AndyError;
use http_body_util::BodyExt;
use http_body_util::Full;
use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_util::rt::TokioIo;
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), AndyError> {
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    eprintln!("listening on {:?}", addr);
    let listener = TcpListener::bind(addr).await?;

    loop {
        let (stream, _) = listener.accept().await?;

        let io = TokioIo::new(stream);

        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .serve_connection(io, service_fn(main_service))
                .await
            {
                eprintln!("Error serving connection: {:?}", err);
            }
        });
    }
}

async fn main_service(
    req: Request<hyper::body::Incoming>,
) -> Result<Response<Full<Bytes>>, AndyError> {
    let uri = req.uri().path();
    let method = req.method();

    macro_rules! endpoints {
        ($(($meth:pat, $uri:expr, $func:expr)),*) => {
            match (method, uri) {
                $((&$meth, $uri) => {
                    let bytes = req.collect().await?.to_bytes();
                    let thing = serde_json::from_reader(bytes.reader())?;
                    $func(thing).await
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
    info: api_structs::CreateCard,
) -> Result<Response<Full<Bytes>>, AndyError> {
    todo!()
}

async fn create_card(
    info: api_structs::CreateCardDeck,
) -> Result<Response<Full<Bytes>>, AndyError> {
    todo!()
}
