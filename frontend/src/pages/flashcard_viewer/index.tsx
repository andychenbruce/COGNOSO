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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Card {
  question: string;
  answer: string;
}

const FlashcardViewerFunc = () => {
  const [flashcards, setFlashcards] = useState<Card[]>([]);
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
          padding: "5px", // Reduce padding
          width: "250px", // Reduce width
          borderRadius: "8px",
          position: "absolute",
          top: "135px",
          left: "590px",
          textAlign: "center",
        }}
      >
        <Typography variant="body1" style={{ fontSize: "20px" }}>
          Deck 1
        </Typography>
      </Paper>
      {flashcards.length > 0 && (
        <Flashcard
          question={flashcards[currentCardIndex].question}
          answer={flashcards[currentCardIndex].answer}
        />
      )}
      <Button
        onClick={addFlashcard}
        style={{
          position: "absolute",
          top: "600px",
          left: "675px",
        }}
      >
        Edit Deck
      </Button>
      <IconButton
        onClick={handlePrevCard}
        disabled={currentCardIndex === 0}
        style={{
          position: "absolute",
          bottom: "325px",
          left: "350px",
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <IconButton
        onClick={handleNextCard}
        disabled={currentCardIndex === flashcards.length - 1}
        style={{
          position: "absolute",
          bottom: "325px",
          right: "350px",
          /*display: 'flex',
          flexDirection: 'column'*/
        }}
      >
        <ArrowForwardIcon />
      </IconButton>
      <Paper
        elevation={3}
        style={{
          padding: "5px", // Reduce padding
          width: "250px", // Reduce width
          borderRadius: "8px",
          position: "absolute",
          top: "550px",
          left: "590px",
          textAlign: "center",
        }}
      >
        <Typography variant="body1" style={{ fontSize: "20px" }}>
          Card {currentCardIndex + 1}/{flashcards.length}
        </Typography>
      </Paper>
    </div>
  );
};

export default FlashcardViewerFunc;
