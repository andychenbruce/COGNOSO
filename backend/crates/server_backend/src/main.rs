mod andy_error;
mod args;
mod server;

use clap::Parser;

use andy_error::AndyError;

use hyper::server::conn::http1;
use hyper::service::service_fn;

use hyper_util::rt::TokioIo;
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), AndyError> {
    let args = args::Args::parse();
    let addr = SocketAddr::from(([0, 0, 0, 0], args.port));
    eprintln!("listening on {:?}", addr);
    let listener = TcpListener::bind(addr).await?;

    let globals: std::sync::Arc<server::SharedState> = std::sync::Arc::new(server::SharedState {
        database: server::database::Database::new(args.database_path)?,
    });

    loop {
        let (stream, _) = listener.accept().await?;

        let io = TokioIo::new(stream);

        let tmp = globals.clone();
        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .serve_connection(io, service_fn(|req| server::main_service(req, tmp.clone())))
                .await
            {
                eprintln!("Error serving connection: {:?}", err);
            }
        });
    }
}
