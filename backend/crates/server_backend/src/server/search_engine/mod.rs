use qdrant_client::prelude::*;
use serde_json::json;

const VECTOR_SIZE: u64 = 384;

#[derive(thiserror::Error, Debug)]
pub enum SearchEngineError {
    #[error("qdrant client error")]
    Qdrant(#[from] anyhow::Error),
    #[error("embedder error")]
    Embedder(#[from] sentence_embedder::EmbedderError),
    #[error("json err")]
    Json(#[from] serde_json::Error),
}

pub struct SearchEngine {
    client: Option<QdrantClient>,
    embedder: Option<sentence_embedder::SentenceEmbedder>,
}

impl SearchEngine {
    pub async fn new(
        qdrant_addr: Option<String>,
        embedder_path: Option<&std::path::Path>,
    ) -> Result<Self, SearchEngineError> {
        let embedder = match embedder_path.map(sentence_embedder::SentenceEmbedder::new) {
            None => None,
            Some(x) => Some(x?),
        };
        let client = match qdrant_addr {
            Some(addr) => {
                let client = QdrantClient::from_url(&addr).build()?;

                client
                    .create_collection(&CreateCollection {
                        collection_name: "andys_collection".into(),
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

    pub async fn add_deck(
        &mut self,
        id: (super::database::UserId, super::database::DeckId),
        cards: Vec<super::database::Card>,
    ) -> Result<(), SearchEngineError> {
        let payload: Payload = json!({
            "user_id": id.0,
            "deck_id": id.1
        })
        .try_into()
        .unwrap();

        let sentences: Vec<_> = cards
            .into_iter()
            .map(|card| format!("Question: {}, Answer {}", card.question, card.answer))
            .collect();

        let vectors = self.get_embedder().run(sentences)?;

        let points: Vec<_> = vectors
            .into_iter()
            .map(|vector| PointStruct::new(0, vector, payload.clone()))
            .collect();

        self.get_client()
            .upsert_points_blocking("andys_collection", None, points, None)
            .await?;

        Ok(())
    }

    pub async fn search_prompt(
        &mut self,
        prompt: &str,
        num_results: u64,
    ) -> Result<Vec<(super::database::UserId, super::database::DeckId)>, SearchEngineError> {
        let vector = self
            .get_embedder()
            .run(vec![prompt.to_owned()])?
            .into_iter()
            .next()
            .unwrap();

        let search_result = self
            .get_client()
            .search_points(&SearchPoints {
                collection_name: "andys_collection".into(),
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
                let deck_id = match point.payload.get("deck_id").unwrap().kind.as_ref().unwrap() {
                    qdrant_client::qdrant::value::Kind::IntegerValue(n) => {
                        TryInto::<u32>::try_into(*n).unwrap()
                    }
                    _ => panic!("todo handle this error"),
                };
                let user_id = match point.payload.get("user_id").unwrap().kind.as_ref().unwrap() {
                    qdrant_client::qdrant::value::Kind::IntegerValue(n) => {
                        TryInto::<u32>::try_into(*n).unwrap()
                    }
                    _ => panic!("todo handle this error"),
                };

                (user_id, deck_id)
            })
            .collect();

        Ok(results)
    }

    fn get_embedder(&mut self) -> &mut sentence_embedder::SentenceEmbedder {
        self.embedder.as_mut().unwrap()
    }
    fn get_client(&mut self) -> &mut QdrantClient {
        self.client.as_mut().unwrap()
    }

    pub fn not_fucked(&self) -> bool {
        matches!((&self.client, &self.embedder), (Some(_), Some(_)))
    }

    pub async fn add_pdf_sentences(
        &mut self,
        user_id: u32,
        deck_id: u32,
        sentences: Vec<String>,
    ) -> Result<(), SearchEngineError> {
        let payloads: Vec<Payload> = sentences
            .iter()
            .map(|x| {
                json!({
                    "text": x.clone()
                })
                .try_into()
                .unwrap()
            })
            .collect();

        let vectors = self.get_embedder().run(sentences)?;

        let points: Vec<_> = vectors
            .into_iter()
            .zip(payloads)
            .map(|(vector, payload)| PointStruct::new(0, vector, payload))
            .collect();

        self.get_client()
            .upsert_points_blocking(
                format!("user_id:{} deck_id{}", user_id, deck_id),
                None,
                points,
                None,
            )
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
            .get_embedder()
            .run(vec![prompt.to_owned()])?
            .into_iter()
            .next()
            .unwrap();

        let search_result = self
            .get_client()
            .search_points(&SearchPoints {
                collection_name: format!("user_id:{} deck_id{}", user_id, deck_id),
                vector,
                limit: num_results,
                with_payload: Some(true.into()),
                ..Default::default()
            })
            .await?;

        let results = search_result
            .result
            .into_iter()
            .map(
                |point| match point.payload.get("text").unwrap().kind.as_ref().unwrap() {
                    qdrant_client::qdrant::value::Kind::StringValue(n) => n.clone(),
                    _ => panic!("todo handle this error"),
                },
            )
            .collect();

        Ok(results)
    }

    pub async fn delete_pdf_data(
        &mut self,
        user_id: u32,
        deck_id: u32,
    ) -> Result<(), SearchEngineError> {
        self.get_client()
            .delete_collection(format!("user_id:{} deck_id{}", user_id, deck_id))
            .await?;
        Ok(())
    }
}

pub async fn search_engine_updater_loop(resources: std::sync::Arc<super::SharedState>) -> ! {
    loop {
        //todo this should use use a MPSC queue of requests for whenever the flashcard database changes instead of running every 20 seconds
        tokio::time::sleep(std::time::Duration::from_secs(20)).await;
        if let Err(e) = loop_inside(&resources).await {
            println!("UPDATING ERROR: {:?}", e);
        }
    }
}

async fn loop_inside(resources: &super::SharedState) -> Result<(), crate::AndyError> {
    let decks = resources.database.get_all_decks()?;

    for deck in decks {
        resources
            .search_engine
            .lock()
            .await
            .add_deck(deck.0, deck.1.cards)
            .await?;
    }

    Ok(())
}
