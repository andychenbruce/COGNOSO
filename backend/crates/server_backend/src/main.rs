mod andy_error;
mod api_structs;
mod args;
mod server;

use clap::Parser;

use andy_error::AndyError;

use hyper::server::conn::http1;
use hyper::service::service_fn;

use hyper_util::rt::TokioIo;
use std::net::SocketAddr;
use tokio::net::TcpListener;

// use rustls_pemfile::{certs, rsa_private_keys};
// use rustls_pki_types::{CertificateDer, PrivateKeyDer};
// use std::path::Path;

// fn load_certs(path: &Path) -> std::io::Result<Vec<CertificateDer<'static>>> {
//     certs(&mut std::io::BufReader::new(std::fs::File::open(path)?)).collect()
// }

// fn load_keys(path: &Path) -> std::io::Result<PrivateKeyDer<'static>> {
//     rsa_private_keys(&mut std::io::BufReader::new(
//         std::fs::File::open(path).unwrap(),
//     ))
//     .next()
//     .unwrap()
//     .map(Into::into)
// }

#[tokio::main]
async fn main() -> Result<(), AndyError> {
    // let certs = load_certs(std::path::Path::new("./tls_certificate/home.local.crt")).unwrap();
    // let key = load_keys(std::path::Path::new("./tls_certificate/home.local.key")).unwrap();

    let args = args::Args::parse();
    let addr = SocketAddr::from(([0, 0, 0, 0], args.port));
    eprintln!("listening on {:?}", addr);
    let listener = TcpListener::bind(addr).await?;

    let globals: std::sync::Arc<server::SharedState> = std::sync::Arc::new(server::SharedState {
        database: server::database::Database::new(args.database_path)?,
        llm_runner: tokio::sync::Mutex::new(Some(
            llm_runner::AndyModel::new(llm_runner::ModelOptions {
                model_path: args.model_path,
                tokenizer_path: args.tokenizer_path,
            })
            .unwrap(),
        )),
    });

    // let mut config = rustls::ServerConfig::builder()
    //     .with_no_client_auth()
    //     .with_single_cert(certs, key)
    //     .unwrap();
    // config.alpn_protocols = vec![b"h2".to_vec(), b"http/1.1".to_vec(), b"http/1.0".to_vec()];
    // let acceptor = tokio_rustls::TlsAcceptor::from(std::sync::Arc::new(config));

    loop {
        let (stream, _peer_addr) = listener.accept().await?;
        // let acceptor = acceptor.clone();
        // let stream = match acceptor.accept(stream).await {
        //     Ok(s) => s,
        //     Err(e) => {
        //         println!("bruh: {:?}", e);
        //         continue;
        //     }
        // };

        let io = TokioIo::new(stream);

        let tmp = globals.clone();
        tokio::task::spawn(async move {
            //if let Err(err) = http2::Builder::new(hyper_util::rt::TokioExecutor::new())
            if let Err(err) = http1::Builder::new()
                .serve_connection(io, service_fn(|req| server::main_service(req, tmp.clone())))
                .await
            {
                eprintln!("Error serving connection: {:?}", err);
            }
        });
    }
}
