// nick's UI changes to flashcard viewer
import "./App.css";
import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import Flashcard from "./Flashcard";
import { Navbar } from "../../navbar";
import {
  ListCards,
  ListCardsResponse,
} from "../../backend_interface";
import { send_json_backend, get_session_token } from "../../utils";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Card {
  question: string;
  answer: string;
}

const FlashcardViewerFunc = () => {
  const [flashcards, setFlashcards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  useEffect(() => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const searchParams = new URLSearchParams(url.search);
    const deckIdJSON = searchParams.get("deck");
    const deckId: number = deckIdJSON ? JSON.parse(deckIdJSON) : null;
    
    const listCards = () => {
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
          setFlashcards(data.cards);
        })
        .catch((error) => {
          console.error("Error displaying cards:", error);
        });
    };
    // Fetch initial flashcards when component mounts
    listCards();
  }, []);

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
          padding: "5px",
          width: "250px",
          borderRadius: "8px",
          position: "absolute",
          top: "135px",
          left: "50%", 
          transform: "translateX(-50%)", 
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
          left: "50%", 
          transform: "translateX(-50%)", 
        }}
      >
        Edit Deck
      </Button>
      <IconButton
        onClick={handlePrevCard}
        disabled={currentCardIndex === 0}
        style={{
          position: "absolute",
          top: "50%", 
          left: "40px", 
          transform: "translateY(-50%)", 
          color: "white",
        }}
      >
        <ArrowBackIcon style={{ fontSize: '40px' }} /> {}
      </IconButton>
      <IconButton
        onClick={handleNextCard}
        disabled={currentCardIndex === flashcards.length - 1}
        style={{
          position: "absolute",
          top: "50%", 
          right: "40px", 
          transform: "translateY(-50%)", 
          color: "white",
        }}
      >
        <ArrowForwardIcon style={{ fontSize: '40px' }} /> {}
      </IconButton>
      <Paper
        elevation={3}
        style={{
          padding: "5px",
          width: "250px",
          borderRadius: "8px",
          position: "absolute",
          top: "550px",
          left: "50%", 
          transform: "translateX(-50%)", 
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
