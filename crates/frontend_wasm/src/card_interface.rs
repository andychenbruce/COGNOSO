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
