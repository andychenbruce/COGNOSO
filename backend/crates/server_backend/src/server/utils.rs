use crate::AndyError;
use http_body_util::Full;
use hyper::body::Bytes;
use hyper::{Request, Response};

pub fn cors_preflight_headers(
    _req: Request<hyper::body::Incoming>,
    methods: Vec<&str>,
) -> Result<Response<Full<Bytes>>, AndyError> {
    let headers = [
        (hyper::header::ACCESS_CONTROL_ALLOW_ORIGIN, "*"),
        (hyper::header::ACCESS_CONTROL_ALLOW_HEADERS, "content-type"),
    ]
    .into_iter()
    .chain(
        methods
            .into_iter()
            .map(|method| (hyper::header::ACCESS_CONTROL_ALLOW_METHODS, method)),
    )
    .collect();

    make_response(hyper::StatusCode::OK, headers, "".to_owned())
}

pub fn make_response(
    status_code: hyper::StatusCode,
    headers: Vec<(hyper::header::HeaderName, &str)>,
    body: String,
) -> Result<Response<Full<Bytes>>, AndyError> {
    let builder = hyper::Response::builder().status(status_code);
    Ok(headers
        .into_iter()
        .fold(builder, |acc, x| acc.header(x.0, x.1))
        .body(Full::new(Bytes::from(body)))?)
}
