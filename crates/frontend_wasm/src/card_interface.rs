use crate::AndyError;
use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
pub async fn make_new_deck() -> Result<(), AndyError> {
    let (username, _password) = crate::get_username_and_password()?;
    let deck_name: String = crate::get_field_from_form(crate::FORM_NEW_DECK)?;

    let req_struct = api_structs::CreateCardDeck {
        user_id: crate::hash(username),
        deck_name,
    };
    let body = serde_json::to_string(&req_struct)?;

    crate::do_post_request(api_structs::ENDPOINT_CREATE_CARD_DECK, Some(body)).await?;

    Ok(())
}

pub async fn list_decks() -> Result<(), AndyError> {
    let (username, _password) = crate::get_username_and_password()?;
    let req_struct = api_structs::ListCardDecks {
        user_id: crate::hash(username),
    };
    let body = serde_json::to_string(&req_struct)?;

    let response: api_structs::ListCardDecksResponse =
        crate::do_post_request_and_deserialize(api_structs::ENDPOINT_LIST_CARD_DECKS, Some(body))
            .await?;

    display_card_deck(response.decks)?;

    Ok(())
}

fn display_card_deck(decks: Vec<api_structs::CardDeck>) -> Result<(), JsValue> {
    let doc = super::get_document().unwrap();
    let output = doc.get_element_by_id("decks_list").unwrap();

    let boxes: Vec<web_sys::HtmlElement> = decks
        .iter()
        .map(|deck: &api_structs::CardDeck| make_output_display(&doc, deck))
        .collect::<Result<_, JsValue>>()?;

    output.replace_children_with_node_0(); //clear

    for elem in boxes {
        output.append_child(&elem)?;
    }

    Ok(())
}

fn make_output_display(
    document: &web_sys::Document,
    deck_info: &api_structs::CardDeck,
) -> Result<web_sys::HtmlElement, JsValue> {
    let top: web_sys::HtmlElement = document.create_element("div")?.dyn_into()?;
    let role: web_sys::HtmlElement = document.create_element("p")?.dyn_into()?;
    let para: web_sys::HtmlElement = document.create_element("p")?.dyn_into()?;
    role.set_inner_text("Bruh");
    para.set_inner_text(&format!("{:?}", deck_info));
    top.style().set_property("background-color", "#FFAA77")?;
    top.style().set_property("border", "solid")?;
    top.replace_children_with_node_2(&role, &para);
    Ok(top)
}
