pub const ENDPOINT_CREATE_CARD_DECK: &str = "/create_card_deck";
pub const ENDPOINT_CREATE_CARD: &str = "/create_card";
pub const ENDPOINT_DELETE_CARD: &str = "/delete_card";
pub const ENDPOINT_NEW_USER: &str = "/new_user";
pub const ENDPOINT_DELETE_USER: &str = "/delete_user";
pub const ENDPOINT_CHANGE_PASSWORD: &str = "/change_password";
pub const ENDPOINT_LIST_CARD_DECKS: &str = "/list_card_decks";
pub const ENDPOINT_LIST_CARDS: &str = "/list_cards";
pub const ENDPOINT_LOGIN: &str = "/login";
pub const ENDPOINT_CREATE_DECK_PDF: &str = "/create_card_deck_pdf";
pub const ENDPOINT_AI_TEST: &str = "/ai_test";

pub type AccessToken = (u32, u32);

#[derive(Debug, serde::Deserialize)]
pub struct CreateCard {
    pub access_token: AccessToken,
    pub deck_id: u32,
    pub question: String,
    pub answer: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct DeleteCard {
    pub access_token: AccessToken,
    pub deck_id: u32,
    pub card_index: u32,
}

#[derive(Debug, serde::Deserialize)]
pub struct CreateCardDeck {
    pub access_token: AccessToken,
    pub deck_name: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct NewUser {
    pub user_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct DeleteUser {
    pub email: String,
    pub password: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct ChangePassword {
    pub email: String,
    pub old_password: String,
    pub new_password: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct ListCardDecks {
    pub access_token: AccessToken,
}

#[derive(Debug, serde::Serialize)]
pub struct ListCardDecksResponse {
    pub decks: Vec<CardDeck>,
}

#[derive(Debug, serde::Serialize)]
pub struct CardDeck {
    pub name: String,
    pub deck_id: u32,
    pub num_cards: u32,
}

#[derive(Debug, serde::Deserialize)]
pub struct ListCards {
    pub access_token: AccessToken,
    pub deck_id: u32,
}

#[derive(Debug, serde::Serialize)]
pub struct ListCardsResponse {
    pub cards: Vec<Card>,
}

#[derive(Debug, serde::Serialize)]
pub struct Card {
    pub question: String,
    pub answer: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, serde::Serialize)]
pub struct LoginResponse {
    pub access_token: AccessToken,
}

#[derive(Debug, serde::Deserialize)]
pub struct UploadPdf {
    pub access_token: AccessToken,
    pub deck_id: u32,
    pub file_bytes_base64: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct AiPromptTest {
    pub prompt: String,
}
