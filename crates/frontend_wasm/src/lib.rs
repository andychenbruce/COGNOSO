//mod llm_interface;
//mod vec_db_interface;
mod card_interface;

use std::hash::Hasher;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

const API_ADDR: &str = "http://localhost:3000";

const FORM_USERNAME: (&str, &str) = ("auth_input_form", "username");
const FORM_PASSWORD: (&str, &str) = ("auth_input_form", "password");
const FORM_NEW_DECK: (&str, &str) = ("new_deck", "new_deck");
const FORM_DECK_ID: (&str, &str) = ("new_card", "new_card_deck_id");
const FORM_CARD_QUESTION: (&str, &str) = ("new_card", "new_card_question");
const FORM_CARD_ANSWER: (&str, &str) = ("new_card", "new_card_answer");
const OUTPUT_ERRORS: &str = "errors_display";
const OUTPUT_DECKS: &str = "decks_list";
const OUTPUT_CARDS: &str = "cards_list";

#[derive(thiserror::Error, Debug)]
pub enum AndyError {
    #[error("javascript error")]
    JavaScript(JsValue),
    #[error("casting failed")]
    DynamicCastFailed,
    #[error("serde error")]
    Serde(#[from] serde_json::Error),
    #[error("no global window")]
    MissingGlobalWindow,
    #[error("no dom")]
    MissingDOM,
    #[error("html missing form")]
    MissingForm(String),
    #[error("html missing field")]
    MissingFormField(String),
    #[error("response status bad")]
    BadResponseStatus(u16, String),
    #[error("integer parse error")]
    IntParseError(#[from] core::num::ParseIntError),
    #[error("missing element")]
    MissingElementId(&'static str),
}

impl From<wasm_bindgen::JsValue> for AndyError {
    fn from(x: JsValue) -> Self {
        AndyError::JavaScript(x)
    }
}

fn set_error_box(error: AndyError) -> Result<(), AndyError> {
    let output_box: web_sys::HtmlParagraphElement = get_document()?
        .get_element_by_id(OUTPUT_ERRORS)
        .ok_or(AndyError::MissingElementId(OUTPUT_ERRORS))?
        .dyn_into()
        .map_err(|_| AndyError::DynamicCastFailed)?;

    output_box.set_inner_text(&format!("Error: {:?}", error));
    Ok(())
}

macro_rules! func_expose {
    ($func:expr, $real_name:ident) => {
        #[wasm_bindgen]
        pub fn $real_name() {
            match $func() {
                Ok(_) => {}
                Err(e) => set_error_box(e).unwrap(),
            }
        }
    };
}

func_expose!(setup_stuff, wasm_setup_stuff);

pub fn setup_stuff() -> Result<(), AndyError> {
    console_error_panic_hook::set_once();

    let dom = get_document()?;

    set_button_callback(&dom, "submit_new_deck", card_interface::make_new_deck)?;
    set_button_callback(&dom, "list_decks", card_interface::list_decks)?;
    set_button_callback(&dom, "list_cards", card_interface::list_cards)?;
    set_button_callback(&dom, "submit_new_card", card_interface::make_new_card)?;

    Ok(())
}

fn set_button_callback<T, O>(
    dom: &web_sys::Document,
    button_id: &'static str,
    func: T,
) -> Result<(), AndyError>
where
    T: Fn() -> O + 'static + Clone,
    O: core::future::Future<Output = Result<(), AndyError>>,
{
    let button: web_sys::HtmlButtonElement = dom
        .get_element_by_id(button_id)
        .ok_or(AndyError::MissingElementId(button_id))?
        .dyn_into()
        .map_err(|_| AndyError::DynamicCastFailed)?;

    let callback = Closure::wrap(Box::new(move |_e: web_sys::Event| {
        let poo = func.clone();
        wasm_bindgen_futures::spawn_local(async move {
            match poo().await {
                Ok(_) => {}
                Err(e) => set_error_box(e).unwrap(),
            }
        })
    }) as Box<dyn Fn(_)>);

    button.add_event_listener_with_callback(
        "click",
        callback
            .as_ref()
            .dyn_ref()
            .ok_or(AndyError::DynamicCastFailed)?,
    )?;
    std::mem::forget(callback); //mem leak, too bad

    Ok(())
}

fn get_field_from_form(form: (&str, &str)) -> Result<String, AndyError> {
    let (form_id, field) = form;
    let form: web_sys::HtmlFormElement = get_document()?
        .forms()
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

async fn do_post_request_and_deserialize<T: for<'a> serde::Deserialize<'a>>(
    url_resource: &str,
    body: Option<String>,
) -> Result<T, AndyError> {
    let resp = do_post_request(url_resource, body).await?;
    let json = JsFuture::from(resp.text()?).await?;
    Ok(serde_json::from_str(
        &json.as_string().ok_or(AndyError::DynamicCastFailed)?,
    )?)
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
    if !resp.ok() {
        let body_text = JsFuture::from(resp.text()?)
            .await?
            .as_string()
            .ok_or(AndyError::DynamicCastFailed)?;
        return Err(AndyError::BadResponseStatus(resp.status(), body_text));
    }

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
