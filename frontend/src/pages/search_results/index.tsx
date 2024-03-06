import React, { useState, Dispatch, useEffect } from "react";
import { Navbar } from "../../navbar";
import "./search_results.css";
import StarIcon from "@mui/icons-material/Star";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewCarouselTwoToneIcon from "@mui/icons-material/ViewCarouselTwoTone";

// import { Button, Grid } from "@mui/material";
import { send_json_backend, get_session_token} from "../../utils";
import {
	CardDeck,
  ENDPOINT_SEARCH_DECKS,
  SearchDecksRequest,
  SearchDecksResponse,
	ListCardDecksResponse,
	ListCardDecks,
	ENDPOINT_LIST_CARD_DECKS,
	ENDPOINT_LIST_FAVORITES,
	ListFavoritesResponse,
	ListFavoritesRequest,
	RandomDecksResponse,
	RandomDecksRequest,
	ENDPOINT_GET_RANDOM_DECKS,
} from "../../backend_interface";

const App: React.FC = () => {

  const get_search_query = () => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const searchParams = new URLSearchParams(url.search);
    const deckIdJSON = searchParams.get("query");
    const deckId = deckIdJSON ? JSON.parse(deckIdJSON) : null;
    return deckId;
  };

	const search_query_to_show = () => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const searchParams = new URLSearchParams(url.search);
    const deckIdJSON = searchParams.get("query");
    return deckIdJSON;
  };

  useEffect(() => {
    let request: SearchDecksRequest = {
      prompt: get_search_query(),
    };
    send_json_backend(ENDPOINT_SEARCH_DECKS, JSON.stringify(request)).then(
      (data: SearchDecksResponse) => {
	console.log(data);
	setDecks(data.decks);
      },
    );
  }, []);
	const updateDecks = () => {
    let token = get_session_token();
    if (token == null) {
      return;
    }
    let request1: ListCardDecks = { access_token: token };
    send_json_backend(ENDPOINT_LIST_CARD_DECKS, JSON.stringify(request1))
      .then((data: ListCardDecksResponse) => {
        setDecks(data.decks);
        // console.log(data.decks);
      })
      .catch((error) => {
        console.error("Error in:", error);
      });
    let request2: ListFavoritesRequest = {
      access_token: token
    };
    send_json_backend(ENDPOINT_LIST_FAVORITES, JSON.stringify(request2))
      .then((data: ListFavoritesResponse) => {
        // console.log('favorited', data)
        setFavorites(data.decks);
      })
      .catch((error) => {
        console.error("Error in:", error);
      });
    let randNum = 5;
    let request3: RandomDecksRequest = {
      num_decks: randNum
    };
    send_json_backend(ENDPOINT_GET_RANDOM_DECKS, JSON.stringify(request3))
    .then((data: RandomDecksResponse) => {
      // console.log('others', data.decks)
      setRandomDecks(data.decks);
    })
    .catch((error) => {
      console.error("Error in:", error);
    });
  };

  const [_favorites, setFavorites]: [CardDeck[], Dispatch<CardDeck[]>] = useState(
    [] as CardDeck[]
  )

	const [_decks, setDecks]: [CardDeck[], Dispatch<CardDeck[]>] = useState(
    [] as CardDeck[]
  );

  const [_randomdecks, setRandomDecks]: [CardDeck[], Dispatch<CardDeck[]>] = useState(
    [] as CardDeck[]
  );

  useEffect(updateDecks, []);

  return (
    <div className="App">
      <div>
	<Navbar />
	<h1 className="HeaderOne"> Search Results; {search_query_to_show()}</h1>
	<div className="Favorites">
	  <h2>{<StarIcon />} Favorites</h2>
	  <div className="Content-box Favorites-box">{}</div>
	</div>
	<div className="Decks">
	  <h2> {<ViewCarouselTwoToneIcon />}Decks</h2>
	  <div className="Content-box Decks-box">{
	
		}
		</div>
	</div>
	<div className="OtherDecks">
	  <h2> {<ViewCarouselIcon />} Decks By Other Users</h2>
	  <div className="Content-box OtherDecks-box">{}</div>
	</div>


      </div>
    </div>
  );
};

export default App;
