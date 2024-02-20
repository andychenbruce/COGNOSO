use http_body_util::BodyExt;
use hyper::body::Buf;

#[derive(thiserror::Error, Debug)]
pub enum LlmError {
    #[error("hyper client error")]
    HyperClient(#[from] hyper::Error),
    #[error("hyper http error")]
    HyperHttp(#[from] hyper::http::Error),
    #[error("llm io error")]
    Io(#[from] std::io::Error),
    #[error("serialization error")]
    Serde(#[from] serde_json::Error),
    #[error("uri messed up idk")]
    HyperUri(#[from] http::uri::InvalidUri),
    #[error("bruh moment")]
    Bruh(#[from] std::convert::Infallible),
    #[error("uri missing authority")]
    UriNoAuthority,
}

pub struct LlmRunner {
    server_address: std::net::SocketAddr,
}

#[derive(serde::Serialize)]
struct LlmRequest {
    prompt: String,
    n_predict: u64,
}

impl LlmRunner {
    pub fn new(server_address: std::net::SocketAddr) -> Self {
        LlmRunner { server_address }
    }

    pub async fn submit_prompt(&self, prompt: String) -> Result<String, LlmError> {
        let stream = tokio::net::TcpStream::connect(self.server_address).await?;

        let io = hyper_util::rt::TokioIo::new(stream);
        let (mut sender, conn) = hyper::client::conn::http1::handshake(io).await?;

        tokio::task::spawn(async move {
            if let Err(err) = conn.await {
                println!("Connection failed: {:?}", err);
            }
        });

        let url = ("http://".to_string() + &format!("{:?}", self.server_address) + "/completion")
            .parse::<hyper::Uri>()?;
        let authority = url.authority().ok_or(LlmError::UriNoAuthority)?.clone();

        let req = hyper::Request::builder()
            .uri(url.path())
            .header(hyper::header::HOST, authority.as_str())
            .method("POST")
            .body(http_body_util::Full::new(hyper::body::Bytes::from(
                serde_json::to_string(&LlmRequest {
                    prompt,
                    n_predict: 512,
                })?,
            )))?;

        let res = sender.send_request(req).await?;

        let bytes = res.collect().await?.to_bytes();
        //let thing = serde_json::from_reader(bytes.reader())?;

        let poo = std::io::read_to_string(bytes.reader())?;

        Ok(poo)
    }
}
