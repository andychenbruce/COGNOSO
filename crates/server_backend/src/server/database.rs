use crate::AndyError;
use redb::ReadableTable;
use std::hash::Hasher;

#[derive(serde::Serialize, serde::Deserialize)]
struct UserEntry {
    username: String,
    email: String,
    password_hash: Vec<u8>,
    signup_time: chrono::DateTime<chrono::offset::Utc>,
    folder_name: std::path::PathBuf,
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct CardDeck {
    creation_time: chrono::DateTime<chrono::offset::Utc>,
    cards: Vec<Card>,
    name: String,
}
#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct Card {
    name: String,
    question: String,
    answer: String,
}

pub struct Database {
    db: redb::Database,
}

impl Database {
    const USERS_TABLE: redb::TableDefinition<'static, &'static str, u64> =
        redb::TableDefinition::new("users");
    const DECKS_TABLE: redb::TableDefinition<'static, (u64, u64), CardDeck> =
        redb::TableDefinition::new("users");

    pub fn new(db_path: std::path::PathBuf) -> Result<Self, AndyError> {
        Ok(Self {
            db: redb::Database::create(db_path)?,
        })
    }

    fn get_user_id(user_name: &str) -> u64 {
        Self::hash(user_name)
    }

    pub fn new_user(&self, info: api_structs::NewUser) -> Result<(), AndyError> {
        let user_id = Self::get_user_id(&info.user_name); //todo idk
        let write_txn = self.db.begin_write()?;
        {
            let mut table = write_txn.open_table(Self::USERS_TABLE)?;
            table.insert(&*info.user_name, user_id)?;
        }
        write_txn.commit()?;
        Ok(())
    }

    pub fn new_card_deck(&self, info: api_structs::CreateCardDeck) -> Result<(), AndyError> {
        let deck_id = Self::hash(&info.deck_name);
        let write_txn = self.db.begin_write()?;
        {
            let mut table = write_txn.open_table(Self::DECKS_TABLE)?;
            table.insert(
                (info.user_id, deck_id),
                CardDeck {
                    creation_time: chrono::Utc::now(),
                    cards: vec![],
                    name: info.deck_name,
                },
            )?;
        }
        write_txn.commit()?;
        Ok(())
    }

    pub fn new_card(&self, info: api_structs::CreateCard) -> Result<(), AndyError> {
        let key = (info.user_id, info.deck_id);

        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;
        let mut deck = table.get(key)?.unwrap().value();
        deck.cards.push(Card {
            question: info.question,
            answer: info.answer,
            name: info.card_name,
        });

        self.insert(key, deck, Self::DECKS_TABLE)?;
        Ok(())
    }

    pub fn list_card_decks(
        &self,
        info: api_structs::ListCardDecks,
    ) -> Result<api_structs::ListCardDecksResponse, AndyError> {
        let user_id = Self::get_user_id(&info.user_name);

        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;

        let mut deck_ids: Vec<u64> = vec![];

        for entry in table.iter()? {
            let entry = entry?.0.value();
            if entry.0 == user_id {
                deck_ids.push(entry.1);
            }
        }

        Ok(api_structs::ListCardDecksResponse {
            decks: deck_ids
                .into_iter()
                .map(|deck_id| api_structs::CardDeck { deck_id })
                .collect(),
        })
    }

    fn insert<'a, K, V>(
        &self,
        key: K,
        val: V,
        table: redb::TableDefinition<'static, K, V>,
    ) -> Result<(), AndyError>
    where
        K: redb::RedbKey + core::borrow::Borrow<<K as redb::RedbValue>::SelfType<'a>>,
        V: redb::RedbValue + core::borrow::Borrow<<V as redb::RedbValue>::SelfType<'a>>,
    {
        let write_txn = self.db.begin_write()?;
        {
            let mut table = write_txn.open_table(table)?;
            table.insert(key, val)?;
        }
        write_txn.commit()?;

        Ok(())
    }

    fn hash<K>(username: K) -> u64
    where
        K: std::hash::Hash,
    {
        let mut hasher = std::collections::hash_map::DefaultHasher::new();
        username.hash(&mut hasher);
        hasher.finish()
    }
}

impl redb::RedbValue for CardDeck {
    type SelfType<'a> = Self;
    type AsBytes<'a> = Vec<u8>;

    fn fixed_width() -> Option<usize> {
        None
    }

    fn from_bytes<'a>(data: &'a [u8]) -> Self::SelfType<'a>
    where
        Self: 'a,
    {
        serde_json::from_slice(data).expect("bruh idk lol")
    }

    fn as_bytes<'a, 'b: 'a>(value: &Self) -> Vec<u8> {
        serde_json::to_vec(value).expect("bruh json")
    }

    fn type_name() -> redb::TypeName {
        redb::TypeName::new("andys_card_deck_idk_lol")
    }
}
