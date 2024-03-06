import React, { useState, Dispatch, useEffect } from "react";
import { Navbar } from "../../navbar";
import "./search_results.css";
import StarIcon from "@mui/icons-material/Star";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewCarouselTwoToneIcon from "@mui/icons-material/ViewCarouselTwoTone";

import { Button, Grid } from "@mui/material";
import { send_json_backend } from "../../utils";
import {
	CardDeck,
  ENDPOINT_SEARCH_DECKS,
  SearchDecksRequest,
  SearchDecksResponse,
} from "../../backend_interface";

const App: React.FC = () => {
  const [decks, setDecks]: [CardDeck[], Dispatch<CardDeck[]>] = useState(
    [] as CardDeck[]
  );

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
	  <div className="Content-box Decks-box">{}</div>
	</div>
	<div className="OtherDecks">
	  <h2> {<ViewCarouselIcon />} Decks By Other Users</h2>
	  <div className="Content-box OtherDecks-box">{}</div>
	</div>

	<Grid
	  container
	  rowSpacing={1}
	  columnSpacing={1}
	  justifyContent="flex-start"
	  style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px" }}
	>
	  {decks.map((deck, index) => (
	    <Grid item xs={3} key={deck.deck_id}>
	      <div style={{ position: "relative" }}>
		<Button
		  variant="contained"
		  color="primary"
		  fullWidth
		  onClick={() => {
		    const url = new URL(
		      window.location.origin + "/flashcard_viewer/",
		    );
		    url.searchParams.append(
		      "deck",
		      JSON.stringify(deck.deck_id),
		    );
		    window.location.href = url.toString();
		  }}
		  style={{
		    width: "100%",
		    height: "70px",
		    fontSize: "1.5rem",
		    marginBottom: "10px",
		    backgroundColor: "#af52bf",
		  }}
		>
		  {JSON.stringify(decks[index])}
		</Button>
	      </div>
	    </Grid>
	  ))}
	</Grid>
      </div>
    </div>
  );
};

export default App;
