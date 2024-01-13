#[derive(serde::Serialize, serde::Deserialize, std::cmp::PartialEq, std::cmp::Eq, std::hash::Hash)]
pub struct CreateCard {
    pub user_token: String,
    pub card_name: String,
    pub question: String,
    pub answer: String,
}

#[derive(serde::Serialize, serde::Deserialize, std::cmp::PartialEq, std::cmp::Eq, std::hash::Hash)]
pub struct CreateCardDeck {
    pub user_token: String,
    pub deck_name: String,
}

#[derive(serde::Serialize, serde::Deserialize, std::cmp::PartialEq, std::cmp::Eq, std::hash::Hash)]
pub struct NewUser {
    pub user_name: String,
    pub email: String,
    pub passwd_hash: Vec<u8>
}
