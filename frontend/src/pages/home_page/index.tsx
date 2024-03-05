import React, {
  Dispatch,
  useState,
  ChangeEventHandler,
  useEffect,
} from "react";
import { Navbar } from "../../navbar";
import "./home.css";
import StarIcon from '@mui/icons-material/Star';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ViewCarouselTwoToneIcon from '@mui/icons-material/ViewCarouselTwoTone';
import { send_json_backend, get_session_token } from "../../utils";
import {
  ListCardDecks,
  ListCardDecksResponse,
  CardDeck,
} from "../../backend_interface";

import {
  Button,
} from "@mui/material";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';


const App: React.FC = () => {

  const [decks, setDecks]: [CardDeck[], Dispatch<CardDeck[]>] = useState(
    [] as CardDeck[],
  );

  const updateDecks = () => {
    let token = get_session_token();
    if (token == null) {
      return;
    }
    let request: ListCardDecks = { access_token: token };
    send_json_backend("/list_card_decks", JSON.stringify(request))
      .then((data: ListCardDecksResponse) => {
        setDecks(data.decks);
        console.log(data.decks);
      })
      .catch((error) => {
        console.error("Error in:", error);
      });
  };
  useEffect(updateDecks, []);

  return (
    <div className="App">
      <Navbar />
      <div className="Favorites">
        
        <h2>{<StarIcon />} Favorites</h2>
        <div className="Content-box Favorites-box">{}</div>
      </div>
      <div className="Decks">
        <h2> {<ViewCarouselTwoToneIcon />}My Decks</h2>
        <div className="Content-box Decks-box">
          <div style={{ display: "flex", overflowX: "auto" }}>
            {decks.map((deck, index) => (
              <div key={deck.deck_id} style={{ marginRight: "10px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const url = new URL(window.location.origin + "/flashcard_viewer/");
                    url.searchParams.append("deck", JSON.stringify(deck.deck_id));
                    window.location.href = url.toString();
                  }}
                  style={{
                    width: "200px",
                    height: "200px",
                    marginBottom: "10px",
                    backgroundColor: "#af52bf",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <SportsSoccerIcon
                    style={{ fontSize: 30, color: "gold", position: "absolute", top: "30%", transform: "translateY(-50%)" }}
                  />
                  <span style={{ marginLeft: "5px", textAlign: "center", padding: "5px", top: "60%" }}>{deck.name}</span>
                </Button>
              </div>
            ))}
            </div>

        
        </div>
      </div>
      <div className="OtherDecks">
        <h2> {<ViewCarouselIcon />} Decks By Other Users</h2>
        <div className="Content-box OtherDecks-box">{}</div>
      </div>
    </div>
  );
};

export default App;
