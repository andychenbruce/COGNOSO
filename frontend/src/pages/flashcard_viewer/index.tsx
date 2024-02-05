import "./App.css";
import React, { useState } from "react";
import { Button, Paper, Typography, InputBase, IconButton } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
import Flashcard from "./Flashcard";
import ArrowButtons from "./ArrowButtons";



const FlashcardViewerFunc = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
  const redirectToAcc_Manage = () => {
    window.location.href = "http://localhost:8000/acc_manage/";
  };
  const redirectToHome_Page = () => {
    window.location.href = "http://localhost:8000/home_page/";
  };
  const redirectToDeck_manage = () => {
    window.location.href = "http://localhost:8000/deck_manage/";
  };
  return (
    <div>
      <div>
        <div style={{
          border: "5px solid #1976d2",
          borderRadius: "15px",
          padding: "5px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px" 
        }}>
          <Button variant="contained" style={{ fontSize: "20px", width: "400px" }} onClick={redirectToHome_Page}>Home</Button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '500px',
            border: '2px solid #1976d2',
            borderRadius: '4px',
            padding: '5px',
          }}>
            <InputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, fontSize: "20px", paddingLeft: "10px" }}
            />
          </div>
          <Button variant="contained" style={{ fontSize: "20px", width: "400px" }} onClick={redirectToDeck_manage}>Decks</Button>
          <Button variant="contained" style={{ fontSize: "20px", width: "400px" }} onClick={redirectToAcc_Manage}>Account</Button>
        </div>
      </div>

      <Paper elevation={3} style={{
        padding: "20px",
        width: "300px",
        borderRadius: "8px",
        position: "absolute",
        top: "200px",
        left: "750px",
        textAlign: "center",
      }}>
        <Typography variant="body1" style={{ fontSize: "50px" }}>Deck 1</Typography>
      </Paper>
      <Flashcard question="What is the capital of France?" answer="Paris" />
      <Paper elevation={3} style={{
        padding: "20px",
        width: "300px",
        borderRadius: "8px",
        position: "absolute",
        top: "850px",
        left: "750px",
        textAlign: "center",
      }}>
        <Typography variant="body1" style={{ fontSize: "50px" }}>
          Card 1/1
        </Typography>
      </Paper>
      <ArrowButtons />
    </div>
  );
};

export default FlashcardViewerFunc;
