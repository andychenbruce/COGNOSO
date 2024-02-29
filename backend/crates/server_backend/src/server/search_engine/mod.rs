use qdrant_client::prelude::*;
use serde_json::json;

const VECTOR_SIZE: u64 = 100;

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
        deck_id: super::database::DeckId,
        cards: Vec<super::database::Card>,
    ) -> Result<(), SearchEngineError> {
        let payload: Payload = json!({
            "deck_id": deck_id
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
    ) -> Result<Vec<super::database::DeckId>, SearchEngineError> {
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

        let results: Vec<super::database::DeckId> = search_result
            .result
            .into_iter()
            .map(
                |point| match point.payload.get("deck_id").unwrap().kind.as_ref().unwrap() {
                    qdrant_client::qdrant::value::Kind::IntegerValue(n) => {
                        TryInto::<u32>::try_into(*n).unwrap()
                    }
                    _ => panic!("bruh"),
                },
            )
            .collect();

        Ok(results)
    }

    fn get_embedder(&mut self) -> &mut sentence_embedder::SentenceEmbedder {
        self.embedder.as_mut().unwrap()
    }
    fn get_client(&mut self) -> &mut QdrantClient {
        self.client.as_mut().unwrap()
    }
}
