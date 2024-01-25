use crate::AndyError;
use crate::OUTPUT_CARDS;
use crate::OUTPUT_DECKS;
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

pub async fn make_new_card() -> Result<(), AndyError> {
    let (username, _password) = crate::get_username_and_password()?;

    let deck_id = crate::get_field_from_form(crate::FORM_DECK_ID)?.parse::<u64>()?;

    let question: String = crate::get_field_from_form(crate::FORM_CARD_QUESTION)?;
    let answer: String = crate::get_field_from_form(crate::FORM_CARD_ANSWER)?;

    let req_struct = api_structs::CreateCard {
        user_id: crate::hash(username),
        deck_id,
        answer,
        question,
    };
    let body = serde_json::to_string(&req_struct)?;

    crate::do_post_request(api_structs::ENDPOINT_CREATE_CARD, Some(body)).await?;

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

fn display_card_deck(decks: Vec<api_structs::CardDeck>) -> Result<(), AndyError> {
    let doc = super::get_document()?;
    let output = doc
        .get_element_by_id(OUTPUT_DECKS)
        .ok_or(AndyError::MissingElementId(OUTPUT_DECKS))?;

    let boxes: Vec<web_sys::HtmlElement> = decks
        .iter()
        .map(|deck: &api_structs::CardDeck| make_decks_display(&doc, deck))
        .collect::<Result<_, JsValue>>()?;

    output.replace_children_with_node_0(); //clear

    for elem in boxes {
        output.append_child(&elem)?;
    }

    Ok(())
}

fn make_decks_display(
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

pub async fn list_cards() -> Result<(), AndyError> {
    let (username, _password) = crate::get_username_and_password()?;
    let deck_id = crate::get_field_from_form(crate::FORM_DECK_ID)?.parse::<u64>()?;
    let req_struct = api_structs::ListCards {
        user_id: crate::hash(username),
        deck_id,
    };
    let body = serde_json::to_string(&req_struct)?;

    let response: api_structs::ListCardsResponse =
        crate::do_post_request_and_deserialize(api_structs::ENDPOINT_LIST_CARDS, Some(body))
            .await?;

    display_cards(response.cards)?;

    Ok(())
}

fn display_cards(cards: Vec<api_structs::Card>) -> Result<(), AndyError> {
    let doc = super::get_document()?;
    let output = doc
        .get_element_by_id(OUTPUT_CARDS)
        .ok_or(AndyError::MissingElementId(OUTPUT_CARDS))?;

    let boxes: Vec<web_sys::HtmlElement> = cards
        .iter()
        .map(|card: &api_structs::Card| make_cards_display(&doc, card))
        .collect::<Result<_, JsValue>>()?;

    output.replace_children_with_node_0(); //clear

    for elem in boxes {
        output.append_child(&elem)?;
    }

    Ok(())
}

fn make_cards_display(
    document: &web_sys::Document,
    deck_info: &api_structs::Card,
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
