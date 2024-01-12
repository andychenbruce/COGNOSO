mod andy_error;

use andy_error::AndyError;
use std::convert::Infallible;
use std::net::SocketAddr;
use http_body_util::Full;
use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_util::rt::TokioIo;
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

async fn main_service(req: Request<hyper::body::Incoming>) -> Result<Response<Full<Bytes>>, Infallible> {
    let uri = req.uri().path();
    let body = req.body();
    match (req.method(), req.uri().path()) {
        (&hyper::Method::POST, "/echo") => {
            Ok(Response::new(Full::new(Bytes::from("Hello, World!"))))
        },
        _ => {
            let mut not_found = Response::new(Full::new(Bytes::from("")));
            *not_found.status_mut() = hyper::StatusCode::NOT_FOUND;
            Ok(not_found)
        }
    }
}
