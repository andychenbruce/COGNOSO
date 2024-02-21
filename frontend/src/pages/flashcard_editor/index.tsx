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
  CreateCard,

} from "../../backend_interface";
import { send_json_backend, get_session_token } from "../../utils";
import { error } from "console";

interface Card {
  //id: string;
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
  const [questionError, setQuestionError] = useState(false);
  const [answerError, setAnswerError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  //console.log(uint32Value); 
  // const _handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (e.key === "Enter") {
  //     Create_card(); // Call Create_card when Enter key is pressed
  //   }
  // };

  const Create_card = () => {
    let deckId = get_deckid();
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }
    const newErrorFields: string[] = [];
    if (!q1) {
      newErrorFields.push('question');
    }
    if (!a1) {
      newErrorFields.push('answer');
    }
    if (newErrorFields.length > 0) {
      // Show snackbar if any error fields
      setSnackbarOpen(true);
      // Set error fields
      setErrorFields(newErrorFields);
      setTimeout(() => {
        // Clear error fields after 2 seconds
        setErrorFields([]);
      }, 2000);
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
      })
      .catch((error) => {
        console.error("Error creating card:", error);
      });
  }
  //let temp;
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

  // const handleEditCard = (index: number) => {
  //   setQuestion(flashcards[index].question);
  //   setAnswer(flashcards[index].answer);
  //   setEditingCardIndex(index);
  // };
    
  // Function to cancel editing
  const cancelEdit = () => {
    setQuestion("");
    setAnswer("");
    setEditingCardIndex(null);
  };

  // Function to save changes to the card
  const saveChanges = (_index: number) => {
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }

    // let updatedCard = {
    //   //id: flashcards[index].id, // Assuming flashcards have an 'id' field
    //   question: question,
    //   answer: answer,
    // };

    // send_json_backend("/update_cards", JSON.stringify({ ...updatedCard, access_token }))
    //   .then((data) => {
    //     console.log("Card updated:", data);

    // Update the flashcards array with the modified card data
    // const updatedFlashcards = [...flashcards];
    // updatedFlashcards[index] = { ...updatedCard };
    // setFlashcards(updatedFlashcards);

    // Reset fields after successful update
    //       cancelEdit();
    //     })
    //     .catch((error) => {
    //       console.error("Error updating card:", error);
    //     });
    // };

    // Function to handle deletion of a card
    // const handleDeleteCard = (index: number) => {
    //   let access_token = get_session_token();
    //   if (access_token == null) {
    //     return;
    //   }

    //   let cardToDelete = flashcards[index];
      
    //   // Make a request to the backend to delete the card
    //   send_json_backend("/delete_card", JSON.stringify({ access_token, card_id: cardToDelete.id }))
    //     .then(() => {
    //       console.log("Card deleted:", cardToDelete);

    //       // Update the flashcards array by removing the deleted card
    //       const updatedFlashcards = [...flashcards];
    //       updatedFlashcards.splice(index, 1);
    //       setFlashcards(updatedFlashcards);
    //     })
    //     .catch((error) => {
    //       console.error("Error deleting card:", error);
    //     });
  };

  useEffect(() => {
    // Fetch initial flashcards when component mounts
    listCards();
  }, []);
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Navbar />
  
      <div style={{ backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', margin: '20px 0', width: '100%', maxWidth: '500px' }}>
      <TextField
        label="Question"
        value={question}
        onChange={(e) => { setQuestion(e.target.value); setq1(e.target.value); }}
        fullWidth
        margin="normal"
        variant="outlined"
        error={errorFields.includes('question')} // Apply error style
        style={{
          borderColor: errorFields.includes('question') ? 'red' : undefined // Apply red border color
        }}
      />
      <TextField
        label="Answer"
        value={answer}
        onChange={(e) => { setAnswer(e.target.value); seta1(e.target.value); }}
        fullWidth
        margin="normal"
        variant="outlined"
        error={errorFields.includes('answer')} // Apply error style
        style={{
          borderColor: errorFields.includes('answer') ? 'red' : undefined // Apply red border color
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
                  error={questionError} // Add this line
                />
                <TextField
                  label="Answer"
                  value={answer}
                  onChange={(e) => { setAnswer(e.target.value); seta1(e.target.value); }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={answerError} // Add this line
                />
                <Button onClick={() => saveChanges(index)}>Save Changes</Button>
                <Button onClick={cancelEdit}>Cancel</Button>
              </>
            ) : (
              <>
                <Typography variant="h6">Question:</Typography>
                <Typography>{flashcard.question}</Typography>
                <Typography variant="h6">Answer:</Typography>
                <Typography>{flashcard.answer}</Typography>
                <Button /*onClick={() => handleEditCard(index)}*/>Edit</Button>
                <Button /*onClick={() => handleDeleteCard(index)}*/>Delete</Button> 
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