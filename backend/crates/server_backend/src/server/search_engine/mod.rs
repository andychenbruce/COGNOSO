use qdrant_client::prelude::*;
use serde_json::json;

const VECTOR_SIZE: u64 = 384;

#[derive(thiserror::Error, Debug)]
pub enum SearchEngineError {
    #[error("thread join error")]
    ThreadJoin(#[from] tokio::task::JoinError),
    #[error("qdrant client error")]
    Qdrant(#[from] anyhow::Error),
    #[error("embedder error")]
    Embedder(#[from] sentence_embedder::EmbedderError),
    #[error("embedder length mismatch")]
    EmbedderLength { expected: usize, got: usize },
    #[error("payload convertsion")]
    PayloadConversion(qdrant_client::serde::PayloadConversionError),
    #[error("payload missing field")]
    PayloadFieldMissing(&'static str),
    #[error("payload missing kind")]
    ValueNoKind,
    #[error("payload wrong kind")]
    ValueWrongKind,
    #[error("integer conversion")]
    IntegerConversionError(#[from] core::num::TryFromIntError),
    #[error("embedder never loaded")]
    EmbedderNeverLoaded,
    #[error("vectordb never loaded")]
    VectorDbNeverLoaded,
}

pub struct SearchEngine {
    client: Option<QdrantClient>,
    embedder: Option<std::sync::Arc<tokio::sync::Mutex<sentence_embedder::SentenceEmbedder>>>,
}

impl SearchEngine {
    const COLLECTION_NAME: &'static str = "andys_collection";
    const FIELD_DECK_ID: &'static str = "deck_id";
    const FIELD_USER_ID: &'static str = "user_id";
    const FIELD_PDF_SENTENCE: &'static str = "text";

    pub async fn new(
        qdrant_addr: Option<String>,
        embedder_path: Option<&std::path::Path>,
    ) -> Result<Self, SearchEngineError> {
        let embedder = match embedder_path.map(sentence_embedder::SentenceEmbedder::new) {
            None => None,
            Some(x) => Some(std::sync::Arc::new(tokio::sync::Mutex::new(x?))),
        };
        let client = match qdrant_addr {
            Some(addr) => {
                let client = QdrantClient::from_url(&addr).build()?;
                client
                    .create_collection(&CreateCollection {
                        collection_name: Self::COLLECTION_NAME.to_owned(),
                        vectors_config: Some(qdrant_client::qdrant::VectorsConfig {
                            config: Some(qdrant_client::qdrant::vectors_config::Config::Params(
                                qdrant_client::qdrant::VectorParams {
                                    size: VECTOR_SIZE,
                                    distance: Distance::Cosine.into(),
                                    ..Default::default()
                                },
                            )),
                        }),
                        ..Default::default()
                    })
                    .await?;

                Some(client)
            }
            None => None,
        };

        Ok(Self { client, embedder })
    }

    pub async fn clear_decks(&mut self) -> Result<(), SearchEngineError> {
        self.get_client()?
            .delete_collection(Self::COLLECTION_NAME.to_owned())
            .await?;

        self.get_client()?
            .create_collection(&CreateCollection {
                collection_name: Self::COLLECTION_NAME.to_owned(),
                vectors_config: Some(qdrant_client::qdrant::VectorsConfig {
                    config: Some(qdrant_client::qdrant::vectors_config::Config::Params(
                        qdrant_client::qdrant::VectorParams {
                            size: VECTOR_SIZE,
                            distance: Distance::Cosine.into(),
                            ..Default::default()
                        },
                    )),
                }),
                ..Default::default()
            })
            .await?;

        Ok(())
    }

    pub async fn add_deck(
        &mut self,
        id: (super::database::UserId, super::database::DeckId),
        cards: Vec<super::database::Card>,
        start_id: u64,
    ) -> Result<u64, SearchEngineError> {
        if cards.is_empty() {
            return Ok(start_id);
        }
        let payload: Payload = json!({
            Self::FIELD_USER_ID: id.0,
            Self::FIELD_DECK_ID: id.1
        })
        .try_into()
        .map_err(SearchEngineError::PayloadConversion)?;

        let sentences: Vec<_> = cards.into_iter().map(format_card).collect();
        //spawn pdf parsing in a new thread so it doesn't block the executor

        let embedder_arc = self.get_embedder()?;
        let vectors = tokio::task::spawn_blocking(move || {
            Ok::<Vec<_>, SearchEngineError>(embedder_arc.blocking_lock().run(sentences)?)
        })
        .await??;

        let points: Vec<_> = vectors
            .into_iter()
            .enumerate()
            .map(|(num, vector)| PointStruct::new(start_id + (num as u64), vector, payload.clone()))
            .collect();
        let num_points = points.len();

        self.get_client()?
            .upsert_points_blocking(Self::COLLECTION_NAME, None, points, None)
            .await?;

        Ok(start_id + (num_points as u64))
    }

    pub async fn search_prompt(
        &mut self,
        prompt: &str,
        num_results: u64,
    ) -> Result<Vec<(super::database::UserId, super::database::DeckId)>, SearchEngineError> {
        let prompt_mem = prompt.to_owned();
        let embedder_arc = self.get_embedder()?;
        let vector = tokio::task::spawn_blocking(move || {
            embedder_arc
                .blocking_lock()
                .run(vec![prompt_mem])?
                .pop()
                .ok_or(SearchEngineError::EmbedderLength {
                    expected: 1,
                    got: 0,
                })
        })
        .await??;

        let search_result = self
            .get_client()?
            .search_points(&SearchPoints {
                collection_name: Self::COLLECTION_NAME.to_owned(),
                vector,
                limit: num_results,
                with_payload: Some(true.into()),
                ..Default::default()
            })
            .await?;

        let results = Self::deserialize_points(search_result.result)?;

        Ok(results)
    }

    fn get_embedder(
        &self,
    ) -> Result<
        std::sync::Arc<tokio::sync::Mutex<sentence_embedder::SentenceEmbedder>>,
        SearchEngineError,
    > {
        self.embedder
            .clone()
            .ok_or(SearchEngineError::EmbedderNeverLoaded)
    }
    fn get_client(&mut self) -> Result<&mut QdrantClient, SearchEngineError> {
        self.client
            .as_mut()
            .ok_or(SearchEngineError::VectorDbNeverLoaded)
    }

    pub fn is_initialized(&self) -> bool {
        matches!((&self.client, &self.embedder), (Some(_), Some(_)))
    }

    pub async fn add_pdf_sentences(
        &mut self,
        user_id: u32,
        deck_id: u32,
        sentences: Vec<String>,
    ) -> Result<(), SearchEngineError> {
        self.get_client()?
            .create_collection(&CreateCollection {
                collection_name: format_pdf_collection(user_id, deck_id),
                vectors_config: Some(qdrant_client::qdrant::VectorsConfig {
                    config: Some(qdrant_client::qdrant::vectors_config::Config::Params(
                        qdrant_client::qdrant::VectorParams {
                            size: VECTOR_SIZE,
                            distance: Distance::Cosine.into(),
                            ..Default::default()
                        },
                    )),
                }),
                ..Default::default()
            })
            .await?;

        let payloads: Vec<Payload> = sentences
            .iter()
            .map(|x| {
                json!({
                    Self::FIELD_PDF_SENTENCE: x.clone()
                })
                .try_into()
                .map_err(SearchEngineError::PayloadConversion)
            })
            .collect::<Result<Vec<_>, SearchEngineError>>()?;

        let embedder_arc = self.get_embedder()?;
        let vectors = tokio::task::spawn_blocking(move || {
            Ok::<Vec<_>, SearchEngineError>(embedder_arc.blocking_lock().run(sentences)?)
        })
        .await??;

        let points: Vec<_> = vectors
            .into_iter()
            .zip(payloads)
            .enumerate()
            .map(|(num, (vector, payload))| PointStruct::new(num as u64, vector, payload))
            .collect();

        self.get_client()?
            .upsert_points_blocking(format_pdf_collection(user_id, deck_id), None, points, None)
            .await?;

        Ok(())
    }

    pub async fn search_relevant_text_for_pdf_question(
        &mut self,
        prompt: &str,
        num_results: u64,
        user_id: u32,
        deck_id: u32,
    ) -> Result<Vec<String>, SearchEngineError> {
        let vector = self
            .get_embedder()?
            .lock()
            .await
            .run(vec![prompt.to_owned()])?
            .pop()
            .ok_or(SearchEngineError::EmbedderLength {
                expected: 1,
                got: 0,
            })?;

        let search_result = self
            .get_client()?
            .search_points(&SearchPoints {
                collection_name: format_pdf_collection(user_id, deck_id),
                vector,
                limit: num_results,
                with_payload: Some(true.into()),
                ..Default::default()
            })
            .await?;

        let results = search_result
            .result
            .into_iter()
            .map(|point| {
                match point
                    .payload
                    .get(Self::FIELD_PDF_SENTENCE)
                    .ok_or(SearchEngineError::PayloadFieldMissing(
                        Self::FIELD_PDF_SENTENCE,
                    ))?
                    .kind
                    .as_ref()
                    .ok_or(SearchEngineError::ValueNoKind)?
                {
                    qdrant_client::qdrant::value::Kind::StringValue(n) => Ok(n.clone()),
                    _ => Err(SearchEngineError::ValueWrongKind),
                }
            })
            .collect::<Result<_, SearchEngineError>>()?;

        Ok(results)
    }

    pub async fn delete_pdf_data(
        &mut self,
        user_id: u32,
        deck_id: u32,
    ) -> Result<(), SearchEngineError> {
        self.get_client()?
            .delete_collection(format_pdf_collection(user_id, deck_id))
            .await?;
        Ok(())
    }

    fn deserialize_points(
        points: Vec<qdrant_client::qdrant::ScoredPoint>,
    ) -> Result<Vec<(u32, u32)>, SearchEngineError> {
        points
            .into_iter()
            .map(|point| {
                let deck_id = Self::extract_integer_from_point(&point, Self::FIELD_DECK_ID)?;
                let user_id = Self::extract_integer_from_point(&point, Self::FIELD_USER_ID)?;

                Ok((user_id, deck_id))
            })
            .collect::<Result<Vec<_>, SearchEngineError>>()
    }

    fn extract_integer_from_point(
        point: &qdrant_client::qdrant::ScoredPoint,
        field: &'static str,
    ) -> Result<u32, SearchEngineError> {
        match point
            .payload
            .get(field)
            .ok_or(SearchEngineError::PayloadFieldMissing(field))?
            .kind
            .as_ref()
            .ok_or(SearchEngineError::ValueNoKind)?
        {
            qdrant_client::qdrant::value::Kind::IntegerValue(n) => {
                TryInto::<u32>::try_into(*n).map_err(|e| e.into())
            }
            _ => Err(SearchEngineError::ValueWrongKind),
        }
    }
}

pub async fn search_engine_updater_loop(
    resources: std::sync::Arc<super::SharedState>,
    mut reindex_queue: tokio::sync::mpsc::UnboundedReceiver<()>,
) -> ! {
    loop {
        if let Err(e) = loop_inside(&resources).await {
            println!("UPDATING ERROR: {:?}", e);
        }

        reindex_queue
            .recv()
            .await
            .expect("search engine update queue all senders were closed");
    }
}

async fn loop_inside(resources: &super::SharedState) -> Result<(), crate::AndyError> {
    let decks = resources.database.get_all_decks()?;

    let mut engine = resources.search_engine.lock().await;

    engine.clear_decks().await?;
    let mut start_id: u64 = 0;
    for deck in decks {
        start_id = engine.add_deck(deck.0, deck.1.cards, start_id).await?;
    }

    Ok(())
}

fn format_card(card: super::database::Card) -> String {
    format!("Question: {}, Answer: {}", card.question, card.answer)
}

fn format_pdf_collection(user_id: u32, deck_id: u32) -> String {
    format!("user_id {} deck_id {}", user_id, deck_id)
}
