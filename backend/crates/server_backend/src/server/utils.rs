use crate::AndyError;
use http_body_util::Full;
use hyper::body::Bytes;
use hyper::{Request, Response};

pub fn cors_preflight_headers(
    _req: Request<hyper::body::Incoming>,
    methods: Vec<&str>,
) -> Result<Response<Full<Bytes>>, AndyError> {
    let headers = [
        ("Access-Control-Allow-Origin", "*"),
        ("Access-Control-Allow-Headers", "content-type"),
    ]
    .into_iter()
    .chain(
        methods
            .into_iter()
            .map(|method| ("Access-Control-Allow-Methods", method)),
    )
    .collect();

    make_response(hyper::StatusCode::OK, headers, "".to_owned())
}

pub fn make_response(
    status_code: hyper::StatusCode,
    headers: Vec<(&str, &str)>,
    body: String,
) -> Result<Response<Full<Bytes>>, AndyError> {
    let builder = hyper::Response::builder().status(status_code);
    Ok(headers
        .into_iter()
        .fold(builder, |acc, x| acc.header(x.0, x.1))
        .body(Full::new(Bytes::from(body)))?)
}
