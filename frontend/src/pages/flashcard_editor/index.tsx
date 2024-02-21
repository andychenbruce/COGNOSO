import React, {
  useState,
  useEffect,
} from "react";
import { Navbar } from "../../navbar";
import "./flashcard_editor.css";
import {
  Button,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import {
  ListCards,
  ListCardsResponse,
} from "../../backend_interface";
import { send_json_backend, get_session_token } from "../../utils";
import { redirect } from "../../utils";
import { DeleteCard } from "../../backend_interface";

interface Card {
  question: string;
  answer: string;
}

const App: React.FC = () => {
  const get_deckid = () => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const searchParams = new URLSearchParams(url.search);
    const deckIdJSON = searchParams.get("deck");
    const deckId = deckIdJSON ? JSON.parse(deckIdJSON) : null;
    return deckId;
  };

  const [flashcards, setFlashcards] = useState<Card[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [q1, setq1] = useState("");
  const [a1, seta1] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const Create_card = () => {
    let deckId = get_deckid();
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }
    if (!q1 || !a1) {
      setSnackbarOpen(true);
      setErrorFields(!q1 ? ['emptyerror'] : ['emptyerror']);
      setTimeout(() => {
        setErrorFields([]);
      }, 2000);
      setq1("");
      seta1("");
      return;
    }
  
    let create_card = {
      access_token: access_token,
      deck_id: deckId,
      question: q1,
      answer: a1,
    };
    send_json_backend("/create_card", JSON.stringify(create_card))
      .then((data) => {
        console.log("result:", data);
        listCards();
        setq1("");
        seta1("");
      })
      .catch((error) => {
        console.error("Error creating card:", error);
      });
  }

  const listCards = () => {
    let deckId = get_deckid();
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
        console.log(flashcards); 
      })
      .catch((error) => {
        console.error("Error displaying cards:", error);
      });
  };
    
  const cancelEdit = () => {
    setQuestion("");
    setAnswer("");
    setEditingCardIndex(null);
  };

  const handleDeleteCard = (index: number) => {
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }

    const cardIndexToDelete = index;

    let deleteCardPayload: DeleteCard = {
      access_token: access_token,
      deck_id: get_deckid(),
      card_index: cardIndexToDelete,
    };

    send_json_backend("/delete_card", JSON.stringify(deleteCardPayload))
      .then(() => {
        console.log("Card deleted with index:", cardIndexToDelete);

        const updatedFlashcards = [...flashcards];
        updatedFlashcards.splice(index, 1);
        setFlashcards(updatedFlashcards);
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
      });
  };

  useEffect(() => {
    listCards();
  }, []);
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Navbar />
      <div style={{
        textAlign: 'left',
        padding: '10px', 
        margin: '20px 0', 
        backgroundColor: '#fff', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        alignSelf: 'flex-start', 
        marginLeft: '20px', 
      }}>
        <Button onClick={() => {redirect("/flashcard_viewer")}}>
          Back
        </Button>
      </div>
      <div style={{ backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', margin: '20px 0', width: '100%', maxWidth: '500px' }}>
      <TextField
        label="Question"
        value={question}
        onChange={(e) => { setQuestion(e.target.value); setq1(e.target.value); }}
        fullWidth
        margin="normal"
        variant="outlined"
        error={errorFields.includes('emptyerror')} 
        style={{
          borderColor: errorFields.includes('emptyerror') ? 'red' : undefined 
        }}
      />
      <TextField
        label="Answer"
        value={answer}
        onChange={(e) => { setAnswer(e.target.value); seta1(e.target.value); }}
        fullWidth
        margin="normal"
        variant="outlined"
        error={errorFields.includes('emptyerror')}
        style={{
          borderColor: errorFields.includes('emptyerror') ? 'red' : undefined
        }}
      />
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button onClick={() => { Create_card(); setAnswer(""); setQuestion(""); }}>Create Card</Button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        {flashcards.map((flashcard, index) => (
           <div key={index} style={{ marginBottom: '10px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', width: '400px', backgroundColor: '#f1f1f1' }}>
           {editingCardIndex === index ? (
              <>
                <TextField
                  label="Question"
                  value={question}
                  onChange={(e) => { setQuestion(e.target.value); setq1(e.target.value); }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Answer"
                  value={answer}
                  onChange={(e) => { setAnswer(e.target.value); seta1(e.target.value); }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Button onClick={cancelEdit}>Cancel</Button>
              </>
            ) : (
              <>
                <Typography variant="h6">Question:</Typography>
                <Typography>{flashcard.question}</Typography>
                <Typography variant="h6">Answer:</Typography>
                <Typography>{flashcard.answer}</Typography>
                <Button /*onClick={() => handleEditCard(index)}*/>Edit</Button>
                <Button onClick={() => handleDeleteCard(index)}>Delete</Button> 
              </>
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} message="Please fill out both the question and answer fields!">
            </Snackbar>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

