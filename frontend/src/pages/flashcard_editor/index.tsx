import React, { useState, useEffect } from "react";
import { Navbar } from "../../navbar";
import "./flashcard_editor.css";
import { Button, TextField, Typography, Snackbar } from "@mui/material";
import { ListCards, ListCardsResponse } from "../../backend_interface";
import {
  send_json_backend,
  get_session_token,
  get_user_id,
  get_param,
} from "../../utils";
import { redirect } from "../../utils";
import {
  ENDPOINT_CREATE_CARD,
  ENDPOINT_LIST_CARDS,
  ENDPOINT_DELETE_CARD,
  ENDPOINT_EDIT_CARD,
  DeleteCard,
  EditCard,
} from "../../backend_interface";
// import { EditCard } from "../../backend_interface";

interface Card {
  question: string;
  answer: string;
}

const App: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Card[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [q1, setq1] = useState("");
  const [a1, seta1] = useState("");

  const [editedQuestion, setEditedQuestion] = useState<string>("");
  const [editedAnswer, setEditedAnswer] = useState<string>("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const handleEditCard = (index: number) => {
    setEditingCardIndex(index);
    const card = flashcards[index];
    setEditedQuestion(card.question);
    setEditedAnswer(card.answer);
  };

  const Create_card = () => {
    const deckId = get_param("deck");
    const access_token = get_session_token();
    if (access_token == null) {
      return;
    }
    if (!q1 || !a1) {
      setSnackbarOpen(true);
      setErrorFields(!q1 ? ["emptyerror"] : ["emptyerror"]);
      setTimeout(() => {
        setErrorFields([]);
      }, 2000);
      setq1("");
      seta1("");
      return;
    }

    const create_card = {
      access_token: access_token,
      deck_id: deckId,
      question: q1,
      answer: a1,
    };
    send_json_backend(ENDPOINT_CREATE_CARD, JSON.stringify(create_card)).then(
      (_data) => {
        listCards();
        setq1("");
        seta1("");
      },
    );
  };

  const listCards = () => {
    const deckId: number | null = get_param("deck");
    const userId = get_user_id();
    if (deckId == null || userId == null) {
      return;
    }
    const prev_cards: ListCards = {
      user_id: userId,
      deck_id: deckId,
    };
    send_json_backend<ListCardsResponse>(
      ENDPOINT_LIST_CARDS,
      JSON.stringify(prev_cards),
    ).then((data: ListCardsResponse) => {
      setFlashcards(data.cards);
    });
  };

  const cancelEdit = () => {
    setQuestion("");
    setAnswer("");
    setEditingCardIndex(null);
  };

  const handleDeleteCard = (index: number) => {
    const access_token = get_session_token();
    const deckId: number | null = get_param("deck");
    if (access_token == null || deckId == null) {
      return;
    }

    const cardIndexToDelete = index;

    const deleteCardPayload: DeleteCard = {
      access_token: access_token,
      deck_id: deckId,
      card_index: cardIndexToDelete,
    };

    send_json_backend(
      ENDPOINT_DELETE_CARD,
      JSON.stringify(deleteCardPayload),
    ).then(() => {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards.splice(index, 1);
      setFlashcards(updatedFlashcards);
    });
  };

  const handleSaveEdit = (index: number) => {
    const access_token = get_session_token();
    const deckId: number | null = get_param("deck");
    if (access_token == null || deckId == null) {
      return;
    }
    const cardIndexToEdit = index;
    const edit_card: EditCard = {
      access_token: access_token,
      deck_id: deckId,
      card_index: cardIndexToEdit,
      new_question: editedQuestion,
      new_answer: editedAnswer,
    };

    send_json_backend(ENDPOINT_EDIT_CARD, JSON.stringify(edit_card)).then(
      (_data) => {
        listCards();
        cancelEdit();
      },
    );
  };

  useEffect(() => {
    listCards();
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Navbar />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "50px",
          backgroundColor: "transparent",
        }}
      >
        <Button
          onClick={() => {
            redirect("/flashcard_viewer", []);
          }}
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "20px",
            margin: "20px 0",
            backgroundColor: "#9370db",
            border: "2px solid purple",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            color: "white",
          }}
        >
          Back
        </Button>
      </div>

      <div
        style={{
          backgroundColor: "#d9a1f7",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          margin: "20px 0",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <TextField
          label="Question"
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setq1(e.target.value);
          }}
          fullWidth
          margin="normal"
          variant="outlined"
          error={errorFields.includes("emptyerror")}
          style={{
            borderColor: errorFields.includes("emptyerror") ? "red" : undefined,
          }}
        />
        <TextField
          label="Answer"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            seta1(e.target.value);
          }}
          fullWidth
          margin="normal"
          variant="outlined"
          error={errorFields.includes("emptyerror")}
          style={{
            borderColor: errorFields.includes("emptyerror") ? "red" : undefined,
          }}
        />
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            onClick={() => {
              Create_card();
              setAnswer("");
              setQuestion("");
            }}
            style={{ border: "1px solid blue" }}
          >
            Create Card
          </Button>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        {flashcards.map((flashcard, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              width: "400px",
              backgroundColor: "#f1f1f1",
            }}
          >
            {editingCardIndex === index ? (
              <>
                <TextField
                  label="Question"
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Answer"
                  value={editedAnswer}
                  onChange={(e) => setEditedAnswer(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Button onClick={() => cancelEdit()}>Cancel</Button>
                <Button onClick={() => handleSaveEdit(index)}>Save</Button>
              </>
            ) : (
              <>
                <Typography variant="h6">Question:</Typography>
                <Typography>{flashcard.question}</Typography>
                <Typography variant="h6">Answer:</Typography>
                <Typography>{flashcard.answer}</Typography>
                <Button onClick={() => handleEditCard(index)}>Edit</Button>
                <Button onClick={() => handleDeleteCard(index)}>Delete</Button>
              </>
            )}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={2000}
              onClose={() => setSnackbarOpen(false)}
              message="Please fill out both the question and answer fields!"
            ></Snackbar>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
