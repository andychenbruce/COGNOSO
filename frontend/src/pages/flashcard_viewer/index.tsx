import "./App.css";
import React, { useState } from "react";
import {
  Button,
  Paper,
  Typography,
  InputBase,
  IconButton,
} from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
import Flashcard from "./Flashcard";
import ArrowButtons from "./ArrowButtons";
import { Navbar } from "../../navbar";

const FlashcardViewerFunc = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  const addFlashcard = () => {
    if (frontText && backText) {
      const newFlashcard = { front: frontText, back: backText };
      setFlashcards([...flashcards, newFlashcard] as any);
      setFrontText("");
      setBackText("");
    }
  };

  const toggleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const togglePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length,
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
      <Flashcard question="What is the capital of France?" answer="Paris" />
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
          Card 1/1
        </Typography>
      </Paper>
      <ArrowButtons />
    </div>
  );
};

export default FlashcardViewerFunc;
