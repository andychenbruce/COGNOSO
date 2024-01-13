pub const ENDPOINT_CREATE_CARD_DECK: &str = "/create_card_deck";
pub const ENDPOINT_CREATE_CARD: &str = "/create_card";
pub const ENDPOINT_NEW_USER: &str = "/new_user";

#[derive(serde::Serialize, serde::Deserialize)]
pub struct CreateCard {
    pub user_id: u64,
    pub deck_id: u64,
    pub card_name: String,
    pub question: String,
    pub answer: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct CreateCardDeck {
    pub user_id: u64,
    pub deck_name: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct NewUser {
    pub user_name: String,
    pub email: String,
    pub passwd_hash: Vec<u8>,
}
