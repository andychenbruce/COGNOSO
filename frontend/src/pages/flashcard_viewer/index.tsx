//this file is used to display all the flashcards

import "./App.css";
import React, { useState, useEffect } from "react";
import { Button, Paper, Typography, IconButton } from "@mui/material";
import { Rating } from "@mui/material";
import Flashcard from "./Flashcard";
import { Navbar } from "../../navbar";
import {
  ENDPOINT_LIST_CARDS,
  ENDPOINT_GET_DECK,
  GetDeckRequest,
  GetDeckResponse,
  ListCards,
  ListCardsResponse,
  ENDPOINT_ADD_RATING,
  AddRating,
} from "../../backend_interface";
import { send_json_backend, get_session_token, get_param } from "../../utils";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Card {
  question: string;
  answer: string;
}

const FlashcardViewerFunc = () => {
  const [flashcards, setFlashcards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [deckName, setDeckName] = useState("Loading...");
  const [value, setValue] = React.useState<number | null>(null);

  useEffect(() => {
    const deckId: number | null = get_param("deck");
    const userId: number | null = get_param("user");
    if (deckId == null || userId == null) {
      setDeckName("Bad Url");
      return;
    }

    const fetchDeckName = async () => {
      //this function just gets the deck name
      const payload: GetDeckRequest = {
        user_id: userId,
        deck_id: deckId,
      };
      const deck_info = await send_json_backend<
        GetDeckRequest,
        GetDeckResponse
      >(ENDPOINT_GET_DECK, payload);
      setDeckName(deck_info.name);
    };

    const listCards = () => {
      //this function lists the card
      const prev_cards: ListCards = {
        user_id: userId,
        deck_id: deckId,
      };
      send_json_backend<ListCards, ListCardsResponse>(
        ENDPOINT_LIST_CARDS,
        prev_cards,
      ).then((data: ListCardsResponse) => {
        setFlashcards(data.cards);
      });
    };

    fetchDeckName();
    listCards();
  }, []);

  const addRating = (newValue: number) => {
    //this function adds ratings for the decks
    const deckId: number | null = get_param("deck");
    const userId: number | null = get_param("user");

    const access_token = get_session_token();
    if (access_token == null || deckId == null || userId == null) {
      return;
    }

    const add_rating: AddRating = {
      access_token: access_token,
      user_id: userId,
      deck_id: deckId,
      new_rating: newValue,
    };
    send_json_backend<AddRating, null>(ENDPOINT_ADD_RATING, add_rating);
  };

  const addFlashcard = () => {
    window.location.pathname = "/flashcard_editor/";
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length,
    );
  };

  const redirectToDeckManage = () => {
    window.location.pathname = "/deck_manage/";
  };

  const redirectToMinigame = () => {
    window.location.pathname = "/minigame/";
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "50px",
            backgroundColor: "transparent",
          }}
        >
          <Button
            onClick={() => {
              redirectToDeckManage();
            }}
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "20px",
              margin: "20px 0",
              backgroundColor: "#9370db",
              border: "2px solid purple",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              color: "white",
            }}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              redirectToMinigame();
            }}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "20px",
              margin: "20px 0",
              backgroundColor: "#9370db",
              border: "2px solid purple",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              color: "white",
            }}
          >
            Minigame
          </Button>
        </div>

        <div
          style={{
            position: "relative",
            maxWidth: "600px",
            width: "100%",
            padding: "0 20px",
            marginTop: "50px",
          }}
        >
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(_event, newValue) => {
              setValue(newValue);
              if (newValue !== null) {
                addRating(newValue);
              }
            }}
          />
          <Paper
            elevation={3}
            style={{
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "20px",
              backgroundColor: "#ce93d8",
              border: "2px solid purple",
            }}
          >
            <Typography
              variant="h5"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {deckName}
            </Typography>{" "}
            {}
          </Paper>
          {flashcards.length > 0 && (
            <Flashcard
              front={flashcards[currentCardIndex].question}
              back={flashcards[currentCardIndex].answer}
            />
          )}
          <IconButton
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            sx={{
              color: "white",
              position: "absolute",
              top: "50%",
              left: "-60px",
              transform: "translateY(-50%)",
              "& svg": { fontSize: 48 },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={handleNextCard}
            disabled={currentCardIndex === flashcards.length - 1}
            sx={{
              color: "white",
              position: "absolute",
              top: "50%",
              right: "-60px",
              transform: "translateY(-50%)",
              "& svg": { fontSize: 48 },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </div>
        <Button
          variant="contained"
          onClick={addFlashcard}
          style={{ backgroundColor: "#9c2caf", border: "1px solid white" }}
        >
          Edit Deck
        </Button>
        <Paper
          elevation={3}
          style={{
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            marginTop: "20px",
            backgroundColor: "#ce93d8",
          }}
        >
          <Typography variant="body1">
            Card {currentCardIndex + 1}/{flashcards.length}
          </Typography>
        </Paper>
      </div>
    </div>
  );
};

export default FlashcardViewerFunc;
