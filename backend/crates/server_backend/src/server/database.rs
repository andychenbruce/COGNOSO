use crate::andy_error::AndyError;
use rand::Rng;
use redb::ReadableTable;
use sha2::Digest;
use std::hash::Hasher;

use crate::api_structs;

const DEFAULT_ICON: u32 = 0;
const SHA256_NUM_BYTES: usize = 32;

type AccessToken = (u32, u32);
pub type UserId = u32;
pub type DeckId = u32;

type UserDeckIdPair = (UserId, DeckId);

#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct UserEntry {
    username: String,
    email: String,
    //idk prolly serde will fix this const generics in the future
    password_hash: Vec<u8>,
    signup_time: u64,
    favorites: Vec<UserDeckIdPair>,
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct CardDeck {
    pub creation_time: u64,
    pub cards: Vec<Card>,
    pub name: String,
    pub rating: f32,
    pub num_ratings: u32,
    pub icon_num: u32,
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Card {
    pub question: String,
    pub answer: String,
}

pub struct Database {
    db: redb::Database,
}

impl Database {
    const USERS_TABLE: redb::TableDefinition<'static, UserId, UserEntry> =
        redb::TableDefinition::new("users");
    const DECKS_TABLE: redb::TableDefinition<'static, (UserId, DeckId), CardDeck> =
        redb::TableDefinition::new("decks");
    const SESSION_TOKENS_TABLE: redb::TableDefinition<'static, AccessToken, UserId> =
        redb::TableDefinition::new("tokens");

    pub fn get_user_id(&self, email: &str) -> UserId {
        //todo make actually good
        hash(email) as u32
    }

    pub fn get_deck_id(&self, name: &str) -> UserId {
        //todo make actually good
        hash(name) as u32
    }

    pub fn new_session(&self, user_id: UserId, password: String) -> Result<AccessToken, AndyError> {
        //todo make an actuall token manager instead of just generating a random number lmao
        self.validate_password(user_id, password)?;

        let mut rng = rand::thread_rng();

        let access_token: AccessToken = rng.gen();

        self.insert_or_replace(access_token, user_id, Self::SESSION_TOKENS_TABLE)?;

        Ok(access_token)
    }

    pub fn validate_password(&self, user_id: UserId, password: String) -> Result<(), AndyError> {
        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::USERS_TABLE)?;
        let user_info = table
            .get(user_id)?
            .ok_or(AndyError::UserDoesNotExist)?
            .value();

        let test_password_hash = sha256_hash(password.as_bytes());
        let real_password_hash: [u8; SHA256_NUM_BYTES] = user_info
            .password_hash
            .try_into()
            .map_err(AndyError::BadHash)?;
        if real_password_hash == test_password_hash {
            Ok(())
        } else {
            Err(AndyError::WrongPassword)
        }
    }

    pub fn validate_token(&self, token: AccessToken) -> Result<UserId, AndyError> {
        //TODO make tokens expire after like a month or something
        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::SESSION_TOKENS_TABLE)?;
        let user_id = table.get(token)?.ok_or(AndyError::BadAccessToken)?.value();
        Ok(user_id)
    }

    pub fn new(db_path: std::path::PathBuf) -> Result<Self, AndyError> {
        let db = redb::Database::create(db_path)?;
        {
            //create tables
            let write_txn = db.begin_write()?;
            write_txn.open_table(Self::USERS_TABLE)?;
            write_txn.open_table(Self::DECKS_TABLE)?;
            write_txn.open_table(Self::SESSION_TOKENS_TABLE)?;
            write_txn.commit()?;
        }
        Ok(Self { db })
    }

    pub fn new_user(
        &self,
        user_name: String,
        email: String,
        password: String,
    ) -> Result<(), AndyError> {
        let user_id = self.get_user_id(&email); //todo idk
        let write_txn = self.db.begin_write()?;
        {
            let mut table = write_txn.open_table(Self::USERS_TABLE)?;
            table.insert(
                user_id,
                UserEntry {
                    username: user_name,
                    email,
                    password_hash: sha256_hash(password.as_bytes()).to_vec(),
                    signup_time: get_current_unix_time_seconds(),
                    favorites: vec![],
                },
            )?;
        }
        write_txn.commit()?;
        Ok(())
    }

    pub fn delete_user(&self, email: String, password: String) -> Result<(), AndyError> {
        let user_id = self.get_user_id(&email); //todo idk
        self.validate_password(user_id, password)?;

        let write_txn = self.db.begin_write()?;
        {
            let mut table = write_txn.open_table(Self::USERS_TABLE)?;
            if table.remove(user_id)?.is_none() {
                return Err(AndyError::UserDoesNotExist);
            }
            let mut table = write_txn.open_table(Self::DECKS_TABLE)?;

            table.drain_filter::<&(u32, u32), _>(.., |key, _val| key.0 == user_id)?;
        }
        write_txn.commit()?;
        Ok(())
    }

    pub fn change_password(
        &self,
        email: String,
        old_password: String,
        new_password: String,
    ) -> Result<(), AndyError> {
        let user_id = self.get_user_id(&email); //todo idk
        self.validate_password(user_id, old_password)?;

        let write_txn = self.db.begin_write()?;
        {
            let mut table = write_txn.open_table(Self::USERS_TABLE)?;
            let entry = table
                .get(user_id)?
                .ok_or(AndyError::UserDoesNotExist)?
                .value();

            let out = UserEntry {
                password_hash: sha256_hash(new_password.as_bytes()).to_vec(),
                ..entry
            };

            table.insert(user_id, out)?;
        }
        write_txn.commit()?;
        Ok(())
    }

    pub fn new_card_deck(&self, user_id: UserId, deck_name: String) -> Result<(), AndyError> {
        let deck_id = self.get_deck_id(&deck_name);
        let write_txn = self.db.begin_write()?;
        {
            let mut table = write_txn.open_table(Self::DECKS_TABLE)?;
            table.insert(
                (user_id, deck_id),
                CardDeck {
                    creation_time: get_current_unix_time_seconds(),
                    cards: vec![],
                    name: deck_name,
                    rating: 0.0,
                    num_ratings: 0,
                    icon_num: DEFAULT_ICON,
                },
            )?;
        }
        write_txn.commit()?;
        Ok(())
    }

    pub fn get_deck_info(
        &self,
        user_id: UserId,
        deck_id: DeckId,
    ) -> Result<api_structs::CardDeck, AndyError> {
        let read_txn = self.db.begin_read()?;

        let table = read_txn.open_table(Self::DECKS_TABLE)?;
        let deck = table
            .get((user_id, deck_id))?
            .ok_or(AndyError::DeckDoesNotExist)?
            .value();

        Ok(api_structs::CardDeck {
            name: deck.name,
            num_cards: deck.cards.len() as u32,
            deck_id,
            user_id,
            icon_num: deck.icon_num,
            rating: deck.rating,
        })
    }

    pub fn delete_card_deck(&self, user_id: UserId, deck_id: DeckId) -> Result<(), AndyError> {
        let write_txn = self.db.begin_write()?;
        {
            let mut table = write_txn.open_table(Self::DECKS_TABLE)?;
            table.remove((user_id, deck_id))?;
        }
        write_txn.commit()?;
        Ok(())
    }

    // pub fn get_rating(&self, user_id: UserId, deck_id: DeckId) -> Result<f32, AndyError> {
    //     let read_txn = self.db.begin_read()?;

    //     let table = read_txn.open_table(Self::DECKS_TABLE)?;
    //     let rating: f32 = table
    //         .get((user_id, deck_id))?
    //         .ok_or(AndyError::DeckDoesNotExist)?
    //         .value()
    //         .rating;
    //     println!(
    //         "user_id = {}, deck_id = {}, sending to frontend rating = {}",
    //         user_id, deck_id, rating
    //     );
    //     Ok(rating)
    // }

    pub fn add_rating(
        &self,
        user_id: UserId,
        deck_id: DeckId,
        new_rating: f32,
    ) -> Result<(), AndyError> {
        let key = (user_id, deck_id);

        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;
        let mut deck = table.get(key)?.ok_or(AndyError::DeckDoesNotExist)?.value();
        println!(
            "changing rating for user_id = {}, deck_id = {}",
            user_id, deck_id
        );
        println!("old rating = {}", deck.rating);
        println!(
            "new rating should be (({} * {}) + {}) / ({})",
            deck.rating,
            deck.num_ratings,
            new_rating,
            deck.num_ratings + 1
        );
        deck.rating = ((deck.rating * (deck.num_ratings as f32)) + new_rating)
            / ((deck.num_ratings + 1) as f32);

        deck.num_ratings += 1;
        println!("new rating = {}", deck.rating);
        println!("num ratings now = {}", deck.num_ratings);

        self.insert_or_replace(key, deck, Self::DECKS_TABLE)?;

        Ok(())
    }

    pub fn new_card(
        &self,
        user_id: UserId,
        deck_id: DeckId,
        question: String,
        answer: String,
    ) -> Result<(), AndyError> {
        let key = (user_id, deck_id);

        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;
        let mut deck = table.get(key)?.ok_or(AndyError::DeckDoesNotExist)?.value();
        deck.cards.push(Card { question, answer });

        self.insert_or_replace(key, deck, Self::DECKS_TABLE)?;
        Ok(())
    }

    pub fn delete_card(
        &self,
        user_id: UserId,
        deck_id: DeckId,
        card_index: u32,
    ) -> Result<(), AndyError> {
        let key = (user_id, deck_id);

        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;
        let mut deck = table.get(key)?.ok_or(AndyError::DeckDoesNotExist)?.value();
        if deck.cards.len() <= (card_index as usize) {
            return Err(AndyError::CardIndexOutOfBounds);
        }
        deck.cards.remove(card_index as usize);

        self.insert_or_replace(key, deck, Self::DECKS_TABLE)?;
        Ok(())
    }

    pub fn edit_card(
        &self,
        user_id: UserId,
        deck_id: DeckId,
        card_index: u32,
        new_question: String,
        new_answer: String,
    ) -> Result<(), AndyError> {
        let key = (user_id, deck_id);

        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;
        let mut deck = table.get(key)?.ok_or(AndyError::DeckDoesNotExist)?.value();
        let card = deck
            .cards
            .get_mut(card_index as usize)
            .ok_or(AndyError::CardIndexOutOfBounds)?;
        card.question = new_question;
        card.answer = new_answer;
        self.insert_or_replace(key, deck, Self::DECKS_TABLE)?;

        Ok(())
    }

    pub fn list_card_decks(
        &self,
        user_id: UserId,
    ) -> Result<api_structs::ListCardDecksResponse, AndyError> {
        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;

        let mut deck_ids: Vec<api_structs::CardDeck> = vec![];

        for entry in table.iter()? {
            let entry = entry?;
            let id_pair = entry.0.value();
            if id_pair.0 == user_id {
                let deck = entry.1.value();
                deck_ids.push(api_structs::CardDeck {
                    user_id,
                    deck_id: id_pair.1,
                    name: deck.name,
                    num_cards: deck.cards.len().try_into()?,
                    icon_num: deck.icon_num,
                    rating: deck.rating,
                });
            }
        }

        Ok(api_structs::ListCardDecksResponse { decks: deck_ids })
    }

    pub fn list_cards(
        &self,
        user_id: UserId,
        deck_id: DeckId,
    ) -> Result<api_structs::ListCardsResponse, AndyError> {
        let key = (user_id, deck_id);

        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;
        let deck = table.get(key)?.ok_or(AndyError::DeckDoesNotExist)?.value();

        Ok(api_structs::ListCardsResponse {
            cards: deck
                .cards
                .into_iter()
                .map(|card: Card| api_structs::Card {
                    question: card.question,
                    answer: card.answer,
                })
                .collect(),
        })
    }

    fn insert_or_replace<'a, K, V>(
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

    pub fn get_all_decks(&self) -> Result<Vec<(UserDeckIdPair, CardDeck)>, AndyError> {
        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;

        let stuff: Vec<((UserId, DeckId), CardDeck)> = table
            .iter()?
            .map(|result| {
                let deck = result?;

                let ids = deck.0.value();
                let cards = deck.1.value();

                Ok((ids, cards))
            })
            .collect::<Result<Vec<_>, AndyError>>()?;

        Ok(stuff)
    }

    pub fn set_deck_icon(
        &self,
        user_id: UserId,
        deck_id: DeckId,
        icon_num: u32,
    ) -> Result<(), AndyError> {
        let key = (user_id, deck_id);

        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;
        let mut deck = table.get(key)?.ok_or(AndyError::DeckDoesNotExist)?.value();
        deck.icon_num = icon_num;
        self.insert_or_replace(key, deck, Self::DECKS_TABLE)?;

        Ok(())
    }

    pub fn list_favorites(
        &self,
        user_id: UserId,
    ) -> Result<api_structs::ListFavoritesResponse, AndyError> {
        let mut user_entry = {
            let read_txn = self.db.begin_read()?;
            let table = read_txn.open_table(Self::USERS_TABLE)?;
            let x = table
                .get(user_id)?
                .ok_or(AndyError::UserDoesNotExist)?
                .value();
            x
        };

        enum LookupResult {
            Found(api_structs::CardDeck),
            NotFound(usize),
        }

        let decks: Vec<LookupResult> = user_entry
            .favorites
            .iter()
            .enumerate()
            .map(|(index, id)| {
                let read_txn = self.db.begin_read()?;
                let table = read_txn.open_table(Self::DECKS_TABLE)?;

                //todo: delete favorites to decks that no longer exist
                let deck = match table.get(id)? {
                    Some(x) => x,
                    None => return Ok(LookupResult::NotFound(index)),
                }
                .value();

                Ok::<_, AndyError>(LookupResult::Found(api_structs::CardDeck {
                    name: deck.name,
                    user_id: id.0,
                    deck_id: id.1,
                    num_cards: deck.cards.len() as u32,
                    icon_num: deck.icon_num,
                    rating: deck.rating,
                }))
            })
            .collect::<Result<_, AndyError>>()?;

        for index in decks.iter().rev().filter_map(|x| match x {
            LookupResult::NotFound(position) => Some(position),
            LookupResult::Found(_) => None,
        }) {
            user_entry.favorites.remove(*index);
        }

        Ok(api_structs::ListFavoritesResponse {
            decks: decks
                .into_iter()
                .filter_map(|x| match x {
                    LookupResult::NotFound(_) => None,
                    LookupResult::Found(deck) => Some(deck),
                })
                .collect(),
        })
    }

    pub fn add_favorite(&self, user_id: UserId, id_pair: UserDeckIdPair) -> Result<(), AndyError> {
        let read_txn = self.db.begin_read()?;
        {
            let table = read_txn.open_table(Self::DECKS_TABLE)?;
            table.get(id_pair)?.ok_or(AndyError::DeckDoesNotExist)?;
        }

        let table = read_txn.open_table(Self::USERS_TABLE)?;
        let mut user = table
            .get(user_id)?
            .ok_or(AndyError::UserDoesNotExist)?
            .value();
        if user.favorites.contains(&id_pair) {
            return Err(AndyError::FavoriteAlreadyExists);
        }

        user.favorites.push(id_pair);
        self.insert_or_replace(user_id, user, Self::USERS_TABLE)?;

        Ok(())
    }

    pub fn delete_favorite(
        &self,
        user_id: UserId,
        id_pair: UserDeckIdPair,
    ) -> Result<(), AndyError> {
        let read_txn = self.db.begin_read()?;
        {
            let table = read_txn.open_table(Self::DECKS_TABLE)?;
            table.get(id_pair)?.ok_or(AndyError::DeckDoesNotExist)?;
        }

        let table = read_txn.open_table(Self::USERS_TABLE)?;
        let mut user = table
            .get(user_id)?
            .ok_or(AndyError::UserDoesNotExist)?
            .value();

        let position = user
            .favorites
            .iter()
            .position(|x| x == &id_pair)
            .ok_or(AndyError::FavoriteDoesNotExist)?;
        user.favorites.remove(position);
        self.insert_or_replace(user_id, user, Self::USERS_TABLE)?;

        Ok(())
    }

    pub fn list_every_single_deck(&self) -> Result<Vec<api_structs::CardDeck>, AndyError> {
        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;

        let thing: Vec<api_structs::CardDeck> = table
            .iter()?
            .map(|x| {
                let pair = x?;
                let (user_id, deck_id) = pair.0.value();
                let deck = pair.1.value();

                Ok::<_, AndyError>(api_structs::CardDeck {
                    name: deck.name,
                    deck_id,
                    user_id,
                    num_cards: deck.cards.len() as u32,
                    icon_num: deck.icon_num,
                    rating: deck.rating,
                })
            })
            .collect::<Result<_, _>>()?;

        Ok(thing)
    }

    pub fn random_decks(&self, num: usize) -> Result<api_structs::RandomDecksResponse, AndyError> {
        let read_txn = self.db.begin_read()?;
        let table = read_txn.open_table(Self::DECKS_TABLE)?;

        let decks = table
            .iter()?
            .take(num)
            .map(|x| {
                let thing = x?;
                let (user_id, deck_id) = thing.0.value();
                let deck = thing.1.value();

                Ok(api_structs::CardDeck {
                    name: deck.name,
                    deck_id,
                    user_id,
                    num_cards: deck.cards.len() as u32,
                    icon_num: deck.icon_num,
                    rating: deck.rating,
                })
            })
            .collect::<Result<Vec<_>, AndyError>>()?;

        Ok(api_structs::RandomDecksResponse { decks })
    }

    pub fn make_deck_from_cards(
        &self,
        user_id: UserId,
        deck_name: &str,
        cards: Vec<api_structs::Card>,
    ) -> Result<(), AndyError> {
        let deck_id = self.get_deck_id(deck_name);
        let write_txn = self.db.begin_write()?;
        {
            let mut table = write_txn.open_table(Self::DECKS_TABLE)?;
            table.insert(
                (user_id, deck_id),
                CardDeck {
                    creation_time: get_current_unix_time_seconds(),
                    cards: cards
                        .into_iter()
                        .map(|card| Card {
                            question: card.question,
                            answer: card.answer,
                        })
                        .collect(),
                    name: deck_name.to_owned(),
                    rating: 0.0,
                    num_ratings: 0,
                    icon_num: DEFAULT_ICON,
                },
            )?;
        }
        write_txn.commit()?;
        Ok(())
    }
}

fn sha256_hash(bytes: &[u8]) -> [u8; SHA256_NUM_BYTES] {
    let mut hasher = sha2::Sha256::new();

    hasher.update(bytes);

    let result: Vec<u8> = hasher.finalize().to_vec();

    result.try_into().expect("sha256 size mismatch")
}

fn hash<K>(username: K) -> u64
where
    K: std::hash::Hash,
{
    let mut hasher = std::collections::hash_map::DefaultHasher::new();
    username.hash(&mut hasher);
    hasher.finish()
}

fn get_current_unix_time_seconds() -> u64 {
    let start = std::time::SystemTime::now();
    start
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs()
}

macro_rules! implement_redb_value {
    ($typename:ty, $unique_identifier:expr) => {
        impl redb::RedbValue for $typename {
            type SelfType<'a> = Self;
            type AsBytes<'a> = Vec<u8>;

            fn fixed_width() -> Option<usize> {
                None
            }

            fn from_bytes<'a>(data: &'a [u8]) -> Self::SelfType<'a>
            where
                Self: 'a,
            {
                serde_json::from_slice(data).expect("database deserialization messed up")
            }

            fn as_bytes<'a, 'b: 'a>(value: &Self) -> Vec<u8> {
                serde_json::to_vec(value).expect("database serialization messed up")
            }

            fn type_name() -> redb::TypeName {
                redb::TypeName::new($unique_identifier)
            }
        }
    };
}

implement_redb_value!(CardDeck, "andy_card_deck");
implement_redb_value!(UserEntry, "andy_user_entry");
