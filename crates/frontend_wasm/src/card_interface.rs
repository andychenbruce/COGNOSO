use crate::AndyError;



pub fn make_new_deck() -> Result<String, AndyError> {
    let (username, _password) = crate::get_username_and_password()?;
    let deck_name: String = crate::get_field_from_form(crate::FORM_NEW_DECK)?;

    let req_struct = api_structs::CreateCardDeck {
        user_id: crate::hash(username),
        deck_name
    };
    Ok(serde_json::to_string(&req_struct)?)
}
