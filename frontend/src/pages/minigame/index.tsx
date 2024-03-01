import React, {
  useState,
  useEffect,
  DragEventHandler,
} from "react";
import { Navbar } from "../../navbar";
//import "./sty.css"
import {
  ListCards,
  ListCardsResponse,
} from "../../backend_interface";
import { send_json_backend, get_session_token } from "../../utils";



interface Card {
  question: string;
  answer: string;
}

const App: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Card[]>([]);
  const [rightCard, setRightCard] = useState<Card>();
  const [leftCard, setLeftCard] = useState<Card>();
  const [visibleFlashcards, setVisibleFlashcards] = useState<number>(4);
  const [shuffledFlashcards, setShuffledFlashcards] = useState<Card[]>([]);


  //const [droppedItems, setDroppedItems] = useState<Card[]>([]);

  const get_deckid = () => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const searchParams = new URLSearchParams(url.search);
    const deckIdJSON = searchParams.get("deck");
    const deckId = deckIdJSON ? JSON.parse(deckIdJSON) : null;
    return deckId;
  };
    
  const check_correct = () => {
    if(rightCard?.answer == leftCard?.answer){
      console.log("IT'S RIGHT!")
    }
    else{
      console.log("IT'S WRONG!")

    }
  
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
            //console.log(flashcards); 
          })
          .catch((error) => {
            console.error("Error displaying cards:", error);
          });
      };

      useEffect(() => {
        listCards();
      }, []);

      const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, card: Card) => {
        e.dataTransfer.setData("card", JSON.stringify(card));
      };
    
      const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
      };
    
      const handleDropLeft: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        const droppedCard = JSON.parse(e.dataTransfer.getData("card"));
        setLeftCard(droppedCard);
      };
    
      const handleDropRight: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        const droppedCard = JSON.parse(e.dataTransfer.getData("card"));
        setRightCard(droppedCard);
      };

      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      
  
      
      const shuffleHandler = () => {
        const rand = getRandomInt(4,flashcards.length)
        const newFlashcards = flashcards.slice(rand-4, rand);
        const shuffledNewFlashcards = [...newFlashcards].sort(() => Math.random() - 0.5);
        setShuffledFlashcards(shuffledNewFlashcards);
        setVisibleFlashcards(4);
      };
      
      useEffect(() => {
        shuffleHandler(); 
      }, []);
    
      const submitHandler = () => {
        if (leftCard && rightCard) {
          if (leftCard.answer === rightCard.answer) {
            alert("Correct");
          } else {
            alert("Incorrect");
          }
        }
      };

      return (
        <div>
          <Navbar />
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Match-Minigame</h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px",
            }}
          >
            <div style={{ width: "25%", marginRight: "20px" }}>
              {shuffledFlashcards.slice(0, visibleFlashcards).map((flashcard, index) => (
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
            border: "1px dashed #ccc",
            padding: "20px",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
          onDragOver={handleDragOver}
          onDrop={handleDropLeft}
          
        >
          <h2>Question</h2>
          {leftCard && <div>{leftCard.question}</div>}
        </div>
        
        <div
          style={{
            width: "30%",
            border: "1px dashed #ccc",
            padding: "20px",
            height: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onDragOver={handleDragOver}
          onDrop={handleDropRight}
        >
          <h2>Answer</h2>
          {rightCard && <div>{rightCard.answer}</div>}
        </div>
            <div style={{ width: "25%", marginLeft: "20px" }}>
              {shuffledFlashcards.slice(0, visibleFlashcards).map((flashcard, index) => (
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
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <button onClick={shuffleHandler} style={{ marginRight: "10px" }}>
                 Shuffle
                </button>
                <button onClick={submitHandler}>Submit</button>
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
