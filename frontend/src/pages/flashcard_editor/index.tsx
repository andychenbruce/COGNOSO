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

interface Card {
  question: string;
  answer: string;
}



const App: React.FC = () => {
  const urlString = window.location.href;

  const url = new URL(urlString);
  const searchParams = new URLSearchParams(url.search);
  const deckIdJSON = searchParams.get("deck");
  const deckId = deckIdJSON ? JSON.parse(deckIdJSON) : null;

let uint32Array = new Uint32Array(1);

let dataView = new DataView(uint32Array.buffer);

uint32Array[0] = deckId;

let uint32Value = dataView.getUint32(0, true); 

const [flashcards, setFlashcards] = useState<Card[]>([]);
const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");


//console.log(uint32Value); 
const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === "Enter") {
    Create_card(); // Call Create_card when Enter key is pressed
  }
};

  const Create_card = () => {
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }
    let create_card: CreateCard = {
      access_token: access_token,
      deck_id: uint32Value,
      question: question,
      answer: answer,
    };
      send_json_backend("/create_card", JSON.stringify(create_card))
      .then((data) => {
        console.log("result:", data);
        listCards();
      })
      .catch((error) => {
        console.error("Error creating card:", error);
      });
  }
  //let temp;
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
            console.log(flashcards); 
          })
          .catch((error) => {
            console.error("Error displaying cards:", error);
          });
    };
    useEffect(() => {
      // Fetch initial flashcards when component mounts
      listCards();
    }, []);
  

  return (
    <div>
      <Navbar />

      <TextField
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyPress={handleKeyPress} // Listen for Enter key press
      />
      <TextField
        label="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={handleKeyPress} // Listen for Enter key press
      />
      <Button onClick={Create_card}>CreateCard</Button>
      {flashcards.map((flashcard, index) => (
        <div key={index}>
          <TextField label="Question" value={flashcard.question}/>
          <TextField label="Answer" value={flashcard.answer} />
        </div>
      ))}
    </div>
  );
};


export default App;
