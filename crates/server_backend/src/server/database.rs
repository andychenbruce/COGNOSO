use crate::AndyError;
use std::hash::Hash;
use std::hash::Hasher;
use std::io::Seek;
use std::io::Write;

#[derive(serde::Serialize, serde::Deserialize)]
struct UsersFile {
    table: std::collections::HashMap<UserEntry, ()>,
}

#[derive(
    serde::Serialize, serde::Deserialize, std::cmp::PartialEq, std::cmp::Eq, std::hash::Hash,
)]
struct UserEntry {
    username: String,
    email: String,
    password_hash: Vec<u8>,
    signup_time: chrono::DateTime<chrono::offset::Utc>,
    folder_name: std::path::PathBuf
}

#[derive(serde::Serialize, serde::Deserialize)]
struct CardDeck {
    creation_time: chrono::DateTime<chrono::offset::Utc>,
    cards: Vec<Card>,
}
#[derive(serde::Serialize, serde::Deserialize)]
struct Card {
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

#[derive(Clone)]
pub struct Database {
    root_dir: std::path::PathBuf,
}

impl Database {
    pub fn new(root_dir: std::path::PathBuf) -> Self {
        Self { root_dir }
    }

    pub fn new_user(&self, info: api_structs::NewUser) -> Result<(), AndyError> {
        let mut file = self.get_user_file()?;
        let mut users: UsersFile = serde_json::from_reader(&file)?;


        let mut tmp: Vec<u8> = info.email.clone().into_bytes();
        tmp . append(&mut info.passwd_hash.clone());
        let mut s = std::collections::hash_map::DefaultHasher::new();
        tmp.hash(&mut s);
        let num = s.finish();
        let folder_name = format!("{:16x}", num);
        
        let insert_result = users.table.insert(
            UserEntry {
                username: info.user_name,
                email: info.email,
                password_hash: info.passwd_hash,
                signup_time: chrono::offset::Utc::now(),
                folder_name: folder_name.into(),
            },
            (),
        );

        assert!(insert_result.is_none());

        file.set_len(0)?;
        file.seek(std::io::SeekFrom::Start(0))?;
        file.write_all(&serde_json::to_string(&users)?.into_bytes())?;
        Ok(())
    }

    pub fn new_card_deck(&self, info: api_structs::CreateCardDeck) -> Result<(), AndyError> {
        let mut s = std::collections::hash_map::DefaultHasher::new();
        info.hash(&mut s);
        let num = s.finish();
        let folder = format!("{:16x}", num);
        
    }
    pub fn new_card(&self, info: api_structs::CreateCard) -> Result<(), AndyError> {
        let mut s = std::collections::hash_map::DefaultHasher::new();
        info.hash(&mut s);
        let poo = s.finish();
        assert!(poo.len() == 16);
        todo!()
    }

    fn get_user_file(&self) -> Result<std::fs::File, AndyError> {
        open_or_create_file_and_parents(self.root_dir.join("users_list.json"))
    }

    fn lookup_user(&self, user_token: String) -> Result<UserEntry, AndyError> {
        let users: UsersFile = serde_json::from_reader(self.get_user_file()?)?;

        for (entry, _) in users.table{
            if entry.username == user_token {
                return Ok(entry)
            }
        }
        
        Err(AndyError::UserDoesNotExist)
    }

}


