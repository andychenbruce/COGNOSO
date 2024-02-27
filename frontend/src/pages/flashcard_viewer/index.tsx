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

  const redirectToDeckManage = () => {
    window.location.pathname = "/deck_manage/"
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Navbar />
      
      <div style={{
        textAlign: 'left',
        padding: '10px', 
        margin: '20px 0', 
        backgroundColor: 'transparent', 
        border: '2px solid purple', 
        borderRadius: '4px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        alignSelf: 'flex-start', 
        marginLeft: '20px', 
      }}>
        <Button onClick={() => {redirectToDeckManage()}} style={{color:'white'}} >
          Back
        </Button>
      </div>
      <div style={{ position: 'relative', maxWidth: '600px', width: '100%', padding: '0 20px', marginTop: '50px',  }}>
        <Paper elevation={3} style={{ padding: "20px", borderRadius: "8px", textAlign: "center", marginBottom: '20px', backgroundColor:'#ce93d8' }}>
          <Typography variant="h5">Deck 1</Typography>
        </Paper>
        {flashcards.length > 0 && (
          <Flashcard
            question={flashcards[currentCardIndex].question}
            answer={flashcards[currentCardIndex].answer}
          />
        )}
        <IconButton onClick={handlePrevCard} disabled={currentCardIndex === 0} sx={{ color:'white', position: 'absolute', top: '50%', left: '-60px', transform: 'translateY(-50%)', '& svg': { fontSize: 48 } }}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={handleNextCard} disabled={currentCardIndex === flashcards.length - 1} sx={{ color: 'white', position: 'absolute', top: '50%', right: '-60px', transform: 'translateY(-50%)', '& svg': { fontSize: 48 } }}>
          <ArrowForwardIcon />
        </IconButton>
      
      </div>
      <Button variant="contained" onClick={addFlashcard} style={{backgroundColor:'#9c2caf', border: '1px solid white'}}>
        Edit Deck
      </Button>
      <Paper elevation={3} style={{ padding: "10px", borderRadius: "8px", textAlign: "center", marginTop: '20px', backgroundColor: '#ce93d8' }}>
        <Typography variant="body1">
          Card {currentCardIndex + 1}/{flashcards.length}
        </Typography>
      </Paper>
    </div>
  );
};

export default FlashcardViewerFunc;