import React, {
  Dispatch,
  useState,
  ChangeEventHandler,
  useEffect,
} from "react";
import { Navbar } from "../../navbar";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  TextField,
  Grid,
  Typography,

} from "@mui/material";
import {
  ListCards,
  ListCardsResponse,
  CreateCard,

} from "../../backend_interface";
import { send_json_backend, get_session_token, redirect } from "../../utils";




const App: React.FC = () => {
  const urlString = window.location.href;

  const url = new URL(urlString);
  const searchParams = new URLSearchParams(url.search);
  const deckIdJSON = searchParams.get("deck");
  const deckId = deckIdJSON ? JSON.parse(deckIdJSON) : null;
  //console.log(deckId)
  const Create_card = () => {
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }
    let create_card: CreateCard = {
      access_token: access_token,
      deck_id: deckId,
      question: "temp_q",
      answer: "temp_a",
    };
      send_json_backend("/create_card", JSON.stringify(create_card))
      .then((data) => {
        console.log("result:", data);
      })
      .catch((error) => {
        console.error("Error creating card:", error);
      });
  }
  
  
  const ListCards = () => {
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }
    let prev_cards: ListCards = {
        access_token: access_token,
        deck_id: deckId,
      };
        send_json_backend("/list_cards", JSON.stringify(prev_cards))
          .then((data: ListCardsResponse) => {
            console.log("Prev_Cards:", data);
          })
          .catch((error) => {
            console.error("Error displaying cards:", error);
          });
    };

  return (
    <div>
        <button onClick = {Create_card}>
            CreateCards
        </button>

        <button onClick = {ListCards}>
            ListCards
        </button>

    </div>

)};

export default App;
