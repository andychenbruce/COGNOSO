#[derive(serde::Serialize, serde::Deserialize)]
pub struct CreateCard {
    pub user_token: String,
    pub card_name: String,
    pub question: String,
    pub answer: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct CreateCardDeck {
    pub user_token: String,
    pub deck_name: String,
}
