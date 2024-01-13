//mod llm_interface;
//mod vec_db_interface;
mod card_interface;

use std::hash::Hasher;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

const API_ADDR: &str = "http://localhost:3000/";

const FORM_USERNAME: (&str, &str) = ("auth_input_form", "username");
const FORM_PASSWORD: (&str, &str) = ("auth_input_form", "password");
const FORM_NEW_DECK: (&str, &str) = ("new_deck", "new_deck");

#[derive(thiserror::Error, Debug)]
pub enum AndyError {
    #[error("javascript error")]
    JavaScript( JsValue),
    #[error("casting failed")]
    DynamicCastFailed,
    #[error("serde error")]
    Serde(#[from] serde_json::Error),
    #[error("serde wasm error")]
    SerdeWasm(#[from] serde_wasm_bindgen::Error),
    #[error("no global window")]
    MissingGlobalWindow,
    #[error("no dom")]
    MissingDOM,
    #[error("html missing form")]
    MissingForm(String),
    #[error("html missing field")]
    MissingFormField(String),
}

impl From<JsValue> for AndyError{
    fn from(x: JsValue) -> Self{
        AndyError::JavaScript(x)
    }
}

fn set_error_box(error: AndyError) -> Result<(), AndyError>{
    todo!()
}


macro_rules! request_func_expose {
    ($func:expr, $real_name:ident, $endpoint:expr) => {
        #[wasm_bindgen]
        pub async fn $real_name(){
            async fn middle() -> Result<web_sys::Response, AndyError>{
                let body = $func()?;
                do_post_request(
                    $endpoint,
                    Some(body)
                ).await
            }
            match middle().await{
                Ok(_) => {},
                Err(e) => set_error_box(e).unwrap()
            }
            
        }
    }
}

request_func_expose!(card_interface::make_new_deck, poo, api_structs::ENDPOINT_CREATE_CARD_DECK);

#[wasm_bindgen]
pub fn setup_stuff() {
    console_error_panic_hook::set_once();
    
}

fn get_field_from_form(form: (&str, &str)) -> Result<String, AndyError> {
    let (form_id, field) = form;
    let form: web_sys::HtmlFormElement = get_forms()?
        .get_with_name(form_id)
        .ok_or(AndyError::MissingForm(form_id.to_owned()))?
        .dyn_into()
        .map_err(|_| AndyError::DynamicCastFailed)?;

    let form_data = web_sys::FormData::new_with_form(&form)?;

    form_data
        .get(field)
        .as_string()
        .ok_or(AndyError::DynamicCastFailed)
}

fn get_window() -> Result<web_sys::Window, AndyError> {
    web_sys::window().ok_or(AndyError::MissingGlobalWindow)
}

fn get_document() -> Result<web_sys::Document, AndyError> {
    get_window()?.document().ok_or(AndyError::MissingDOM)
}

fn get_forms() -> Result<web_sys::HtmlCollection, AndyError> {
    Ok(get_document()?.forms())
}

async fn do_post_request_and_deserialize<T: for<'a> serde::Deserialize<'a>>(
    url_resource: &str,
    body: Option<String>,
) -> Result<T, AndyError> {
    let resp = do_post_request(url_resource, body).await?;
    let json = JsFuture::from(resp.json()?).await?;
    Ok(serde_wasm_bindgen::from_value(json)?)
}

async fn do_post_request(
    url_resource: &str,
    body: Option<String>,
) -> Result<web_sys::Response, AndyError> {
    let mut opts = web_sys::RequestInit::new();
    opts.method("POST");
    opts.mode(web_sys::RequestMode::Cors);

    let body_val: Option<JsValue> = body.map(|x| x.into());
    opts.body(body_val.as_ref());

    let request =
        web_sys::Request::new_with_str_and_init(&(API_ADDR.to_owned() + url_resource), &opts)?;

    let resp_value = JsFuture::from(get_window()?.fetch_with_request(&request)).await?;

    let resp: web_sys::Response = resp_value.dyn_into()?;

    Ok(resp)
}

fn get_username_and_password() -> Result<(String, String), AndyError> {
    let username: String = get_field_from_form(FORM_USERNAME)?;
    let password: String = get_field_from_form(FORM_PASSWORD)?;
    Ok((username, password))
}

fn hash<K>(username: K) -> u64
    where
        K: std::hash::Hash,
    {
        let mut hasher = std::collections::hash_map::DefaultHasher::new();
        username.hash(&mut hasher);
        hasher.finish()
    }



