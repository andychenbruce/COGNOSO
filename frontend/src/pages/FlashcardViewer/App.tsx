import './App.css';
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Flashcard from './Flashcard';
import ArrowButtons from './ArrowButtons';



function FlashcardViewerFunc() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');

  const addFlashcard = () => {
    if (frontText && backText) {
      const newFlashcard = { front: frontText, back: backText };
      setFlashcards([...flashcards, newFlashcard] as any);
      setFrontText('');
      setBackText('');
    }
  };

  const toggleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const togglePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };


  return (
    <div  >
      <Button variant="contained" style={{ marginRight: '10px', fontSize: '50px', width: '400px' }}>Home</Button>
      <Button variant="contained" style={{ marginRight: '10px', fontSize: '50px', width: '500px' }}>Search Bar</Button>
      <Button variant="contained" style={{ marginRight: '10px', fontSize: '50px', width: '400px' }}>Decks</Button>
      <Button variant="contained" style={{ marginRight: '10px', fontSize: '50px', width: '400px' }}>Account</Button>
      <Paper elevation={3} style={{ padding: '20px', width: '300px', borderRadius: '8px', 
                position: 'absolute',  // or 'relative' based on your layout
                top: '200px',          // adjust the top position
                left: '750px',         // adjust the left position
                textAlign: 'center',  // center the text horizontally within the box

        
    }}>
      <Typography variant="body1" style={{ fontSize: '50px' }}>
        Deck 1
      </Typography>
      </Paper>
      <Flashcard question="What is the capital of France?" answer="Paris" />
      <Paper elevation={3} style={{ padding: '20px', width: '300px', borderRadius: '8px', 
                position: 'absolute',  // or 'relative' based on your layout
                top: '850px',          // adjust the top position
                left: '750px',         // adjust the left position
                textAlign: 'center',  // center the text horizontally within the box

        
    }}>
      <Typography variant="body1" style={{ fontSize: '50px' }}>
        Card 1/1
      </Typography>
      </Paper>
      <ArrowButtons />


  </div>

  );
}

export default FlashcardViewerFunc;
