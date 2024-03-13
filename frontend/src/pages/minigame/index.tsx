import React, { useState, useEffect, DragEventHandler } from "react";
import { Navbar } from "../../navbar";
//import "./sty.css"
import {
  ENDPOINT_LIST_CARDS,
  ListCards,
  ListCardsResponse,
} from "../../backend_interface";
import { send_json_backend, get_session_token, get_user_id } from "../../utils";
import { Button } from "@mui/material";

interface Card {
  question: string;
  answer: string;
}

const App: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Card[]>([]);
  const [rightCard, setRightCard] = useState<Card>();
  const [leftCard, setLeftCard] = useState<Card>();

  const [shuffledFlashcards, setShuffledFlashcards] = useState<Card[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const get_deckid = () => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const searchParams = new URLSearchParams(url.search);
    const deckIdJSON = searchParams.get("deck");
    const deckId = deckIdJSON ? JSON.parse(deckIdJSON) : null;
    return deckId;
  };

  const check_correct = () => {
    if (rightCard?.answer == leftCard?.answer) {
      console.log("IT'S RIGHT!");
    } else {
      console.log("IT'S WRONG!");
    }
  };
  const resetCards = () => {
    setLeftCard(undefined);
    setRightCard(undefined);
    setIsCorrect(null);
  };

  const nextHandler = () => {
    resetCards();
    shuffleHandler();
    //suffle the card and resets the middle section when called.
  };

  const listCards = () => {
    const deckId = get_deckid();
    const access_token = get_session_token();
    const user_id = get_user_id();
    if (access_token == null || user_id == null) {
      return;
    }
    const prev_cards: ListCards = {
      user_id: user_id,
      deck_id: deckId,
    };
    send_json_backend<ListCards, ListCardsResponse>(
      ENDPOINT_LIST_CARDS,
      prev_cards,
    )
      .then((data: ListCardsResponse) => {
        setFlashcards(data.cards);
      })
      .catch((error) => {
        console.error("Error displaying cards:", error);
      });
  };

  useEffect(() => {
    listCards();
  }, []);

  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    card: Card,
  ) => {
    e.dataTransfer.setData("card", JSON.stringify(card));
    //gets mouse position
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", e.clientY.toString());
  };

  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const mouseY = e.clientY;
    const threshold = window.innerHeight / 3;

    if (mouseY < threshold) {
      const scrollDistance = threshold - mouseY;
      // Calculate the scroll speed based on mouse position
      const scrollSpeed = scrollDistance / threshold;
      // Calculate the new scroll position
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newScroll = scrollTop - scrollSpeed * 10;

      const animateScroll = () => {
        const difference = newScroll - window.scrollY;
        const step = difference / 5;
        if (Math.abs(step) > 1) {
          window.scrollBy(0, step);
          requestAnimationFrame(animateScroll);
        } else {
          window.scrollTo(0, newScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  const handleDropLeft: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const droppedCard = JSON.parse(e.dataTransfer.getData("card"));
    setLeftCard(droppedCard);
    //This drops the left hand cards on the left answer slot
  };

  const handleDropRight: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const droppedCard = JSON.parse(e.dataTransfer.getData("card"));
    setRightCard(droppedCard);
    //This drops the right hand cards on the right answer slot
  };

  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const shuffleHandler = () => {
    const rand = getRandomInt(4, flashcards.length);
    const newFlashcards = flashcards.slice(rand - 4, rand);
    const shuffledNewFlashcards = [...newFlashcards].sort(
      () => Math.random() - 0.5,
    );
    setShuffledFlashcards(shuffledNewFlashcards);
    //this is to only show 4 cards at a time shuffle them when called.
  };

  useEffect(() => {
    shuffleHandler();
  }, []);

  const submitHandler = () => {
    if (leftCard != undefined && rightCard != undefined) {
      if (leftCard.answer === rightCard.answer) {
        setIsCorrect(true);
        for (let i = 0; i < flashcards.length; i++) {
          if (flashcards[i] == leftCard) {
            flashcards.splice(i, 1); // Removes 1 element starting from indexToRemove
          }
        }
      } else {
        setIsCorrect(false);
      }
    }
  };
  useEffect(() => {
    // This effect will be triggered whenever leftCard.question changes
    // You can perform any action here that you want to happen when the question changes
    if (leftCard) {
      submitHandler();
    }
  }, [leftCard]); // Re-run the effect whenever leftCard changes
  useEffect(() => {
    // This effect will be triggered whenever leftCard.question changes
    // You can perform any action here that you want to happen when the question changes
    if (rightCard) {
      submitHandler();
    }
  }, [rightCard]); // Re-run the effect whenever leftCard changes

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
        <h1>Matching Minigame</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "25%",
            marginRight: "20px",
            border: "2px solid yellow",
            borderRadius: "10px",
            padding: "10px",
            overflow: "auto",
          }}
        >
          {shuffledFlashcards
            .sort(() => Math.random() * 100.12012)
            .map((flashcard, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <button
                  draggable
                  onDragStart={(e) => handleDragStart(e, flashcard)}
                  onClick={() => {
                    setLeftCard(flashcard);
                    check_correct();
                  }}
                  style={{ ...buttonStyle, width: "100%" }}
                >
                  {flashcard.question}
                </button>
              </div>
            ))}
        </div>

        <div
          style={{
            width: "30%",
            color: "white",
            border: "1px dashed #ccc",
            padding: "20px",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
            overflow: "auto",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor:
              isCorrect === false
                ? "red"
                : isCorrect === true
                  ? "green"
                  : "inherit",
          }}
          onDragOver={handleDragOver}
          onDrop={handleDropLeft}
        >
          <h2>Question </h2>
          {leftCard && <div>{leftCard.question}</div>}
        </div>

        <div
          style={{
            width: "30%",
            border: "1px dashed #ccc",
            color: "white",
            padding: "20px",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "10px",
            borderRadius: "10px",
            overflow: "auto",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor:
              isCorrect === false
                ? "red"
                : isCorrect === true
                  ? "green"
                  : "inherit",
          }}
          onDragOver={handleDragOver}
          onDrop={handleDropRight}
        >
          <h2>Answer</h2>
          {rightCard && <div>{rightCard.answer}</div>}
        </div>

        <div
          style={{
            width: "25%",
            marginLeft: "20px",
            border: "2px solid yellow",
            borderRadius: "10px",
            padding: "10px",
            overflow: "auto",
          }}
        >
          {shuffledFlashcards
            .sort(() => Math.random() - 0.5)
            .map((flashcard, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <button
                  draggable
                  onDragStart={(e) => handleDragStart(e, flashcard)}
                  onClick={() => {
                    setRightCard(flashcard);
                    check_correct();
                  }}
                  style={{ ...buttonStyle, width: "100%" }}
                >
                  {flashcard.answer}
                </button>
              </div>
            ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "calc(100% - 150px)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
        }}
      >
        <Button
          onClick={shuffleHandler}
          style={{ marginRight: "10px", backgroundColor: "white" }}
        >
          Start
        </Button>
        <Button
          onClick={nextHandler}
          style={{ marginLeft: "10px", backgroundColor: "white" }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "25%",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "background-color 0.3s",
};
export default App;
