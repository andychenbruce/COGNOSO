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

fn open_or_create_file_and_parents(path: std::path::PathBuf) -> Result<std::fs::File, AndyError> {
    std::fs::create_dir_all(path.parent().unwrap())?;

    match std::fs::File::options()
        .read(true)
        .write(true)
        .create_new(true)
        .open(&path)
    {
        Ok(x) => Ok(x),
        Err(e) => {
            if e.kind() == std::io::ErrorKind::AlreadyExists {
                Ok(std::fs::File::open(&path)?)
            } else {
                Err(e.into())
            }
        }
    }
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

    pub fn new_user(&self, info: api_structs::NewUser) -> Result<(), AndyError> {
        let user_id = Self::hash(&info.user_name); //todo idk
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
        todo!()
    }

    fn as_bytes<'a, 'b: 'a>(value: &Self) -> Vec<u8> {
        todo!()
    }

    fn type_name() -> redb::TypeName {
        redb::TypeName::new("andys_card_deck_idk_lol")
    }
}
