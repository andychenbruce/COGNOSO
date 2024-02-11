import "./App.css";
import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Typography,
  InputBase,
  IconButton,
} from "@mui/material";
import Flashcard from "./Flashcard";
import ArrowButtons from "./ArrowButtons";
import { Navbar } from "../../navbar";
import {
  ListCards,
  ListCardsResponse,
  CreateCard,
} from "../../backend_interface";
import { send_json_backend, get_session_token, redirect } from "../../utils";

const FlashcardViewerFunc = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  const urlString = window.location.href;
  const url = new URL(urlString);
  const searchParams = new URLSearchParams(url.search);
  const deckIdJSON = searchParams.get("deck");
  const deckId = deckIdJSON ? JSON.parse(deckIdJSON) : null;

  let uint32Array = new Uint32Array(1);
  let dataView = new DataView(uint32Array.buffer);
  uint32Array[0] = deckId;
  let uint32Value = dataView.getUint32(0, true);

  useEffect(() => {
    const listCards = () => {
      let access_token = get_session_token();
      if (access_token == null) {
        return;
      }
      let prev_cards: ListCards = {
        access_token: access_token,
        deck_id: uint32Value,
      };
      send_json_backend("/list_cards", JSON.stringify(prev_cards))
        .then((data: ListCardsResponse) => {
          console.log("Prev_Cards:", data);
          setFlashcards(data.cards);
        })
        .catch((error) => {
          console.error("Error displaying cards:", error);
        });
    };
    // Fetch initial flashcards when component mounts
    listCards();
  }, [deckId]);

  const addFlashcard = () => {
    window.location.pathname = "/flashcard_editor/";
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  return (
    <div>
      <Navbar />
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          width: "300px",
          borderRadius: "8px",
          position: "absolute",
          top: "200px",
          left: "750px",
          textAlign: "center",
        }}
      >
        <Typography variant="body1" style={{ fontSize: "50px" }}>
          Deck 1
        </Typography>
      </Paper>
      {flashcards.length > 0 && (
        <Flashcard
          question={flashcards[currentCardIndex].question}
          answer={flashcards[currentCardIndex].answer}
        />
      )}
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          width: "300px",
          borderRadius: "8px",
          position: "absolute",
          top: `${flashcards.length * 100 + 100}px`,
          left: "750px",
          textAlign: "center",
        }}
      >
        <Typography variant="body1" style={{ fontSize: "50px" }}>
          Card {currentCardIndex + 1}/{flashcards.length}
        </Typography>
      </Paper>
      <ArrowButtons
        toggleNextCard={handleNextCard}
        togglePrevCard={handlePrevCard}
      />
      <Button onClick={addFlashcard}>Edit Deck</Button>
      <Button onClick={handlePrevCard} disabled={currentCardIndex === 0}>
        Previous Card
      </Button>
      <Button
        onClick={handleNextCard}
        disabled={currentCardIndex === flashcards.length - 1}
      >
        Next Card
      </Button>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          width: "300px",
          borderRadius: "8px",
          position: "absolute",
          top: "850px",
          left: "750px",
          textAlign: "center",
        }}
      >
        <Typography variant="body1" style={{ fontSize: "50px" }}>
          Card {currentCardIndex + 1}/{flashcards.length}
        </Typography>
      </Paper>

    </div>
  );
};

export default FlashcardViewerFunc;
