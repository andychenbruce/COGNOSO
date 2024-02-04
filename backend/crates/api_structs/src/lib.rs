pub const ENDPOINT_CREATE_CARD_DECK: &str = "/create_card_deck";
pub const ENDPOINT_CREATE_CARD: &str = "/create_card";
pub const ENDPOINT_NEW_USER: &str = "/new_user";
pub const ENDPOINT_LIST_CARD_DECKS: &str = "/list_card_decks";
pub const ENDPOINT_LIST_CARDS: &str = "/list_cards";
pub const ENDPOINT_LOGIN: &str = "/login";

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct CreateCard {
    pub access_token: String,
    pub deck_id: u64,
    pub question: String,
    pub answer: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct CreateCardDeck {
    pub access_token: String,
    pub deck_name: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct NewUser {
    pub user_name: String,
    pub email: String,
    pub passwd_hash: Vec<u8>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ListCardDecks {
    pub user_id: u64,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ListCardDecksResponse {
    pub decks: Vec<CardDeck>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct CardDeck {
    pub name: String,
    pub deck_id: u64,
    pub num_cards: u64,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ListCards {
    pub user_id: u64,
    pub deck_id: u64,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ListCardsResponse {
    pub cards: Vec<Card>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Card {
    pub question: String,
    pub answer: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password_sha256: Vec<u8>,
}

//crypto.createHash('sha256').update(input).digest('hex');
#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct LoginResponse {
    pub access_token: String,
}
