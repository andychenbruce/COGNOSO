pub const ENDPOINT_CREATE_CARD_DECK: &str = "/create_card_deck";
pub const ENDPOINT_CREATE_CARD: &str = "/create_card";
pub const ENDPOINT_NEW_USER: &str = "/new_user";
pub const ENDPOINT_LIST_CARD_DECKS: &str = "/list_card_decks";

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

#[derive(serde::Serialize, serde::Deserialize)]
pub struct ListCardDecks {
    pub user_name: String,
    pub email: String,
    pub passwd_hash: Vec<u8>,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct ListCardDecksResponse {
    pub decks: Vec<CardDeck>,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct CardDeck {
    pub deck_id: u64,
}
