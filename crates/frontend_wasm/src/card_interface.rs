use crate::AndyError;
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

    web_sys::console::log_1(&format!("{:?}", response).into());

    Ok(())
}
