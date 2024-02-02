mod andy_error;
mod args;

use andy_error::AndyError;

use clap::Parser;

use std::io::Read;

fn get_content_type(path: &std::path::Path) -> Result<&str, AndyError> {
    if let Some(ext) = path.extension() {
        match ext.to_str().ok_or(AndyError::BadUriPath)? {
            "html" => Ok("text/html"),
            "css" => Ok("text/css"),
            "js" => Ok("text/javascript"),
            "wasm" => Ok("application/wasm"),
            _ => Ok("application/octet-stream"),
        }
    } else {
        Ok("application/octet-stream")
    }
}

async fn andy_handle(
    req: hyper::Request<hyper::body::Incoming>,
    path: std::sync::Arc<std::path::PathBuf>,
) -> Result<hyper::Response<http_body_util::Full<hyper::body::Bytes>>, AndyError> {
    let path_end = std::path::Path::new(&req.uri().path()[1..]);
    let path = path.as_path().join(path_end);
    let mut f = std::fs::File::open(path)?;
    let mut data: Vec<u8> = vec![];
    f.read_to_end(&mut data)?;

    let content_type = get_content_type(path_end)?;

    Ok(hyper::Response::builder()
        .status(hyper::StatusCode::OK)
        .header("Access-Control-Allow-Origin", "*")
        .header("content-type", content_type)
        .body(data.into())?)
}

#[tokio::main]
async fn main() -> Result<(), AndyError> {
    let args = args::AndyArgs::parse();
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], args.port));

    let listener = tokio::net::TcpListener::bind(addr).await?;

    loop {
        let (stream, _) = listener.accept().await?;

        let io = hyper_util::rt::TokioIo::new(stream);

        let path = std::sync::Arc::new(args.root_serve_path.clone());
        tokio::task::spawn(async move {
            if let Err(err) = hyper::server::conn::http1::Builder::new()
                .serve_connection(
                    io,
                    hyper::service::service_fn(|x| andy_handle(x, path.clone())),
                )
                .await
            {
                eprintln!("Error serving connection: {:?}", err);
            }
        });
    }
}
