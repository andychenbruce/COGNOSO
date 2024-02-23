import React, {
  useState,
  useEffect,
} from "react";
import { Navbar } from "../../navbar";
//import './.css'
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
    
    
    return (
        <div>
          <Navbar />
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            {flashcards.map((flashcard, index) => (
                <button onClick={() => { setLeftCard(flashcard); check_correct(); }} style={buttonStyle}>{flashcard.question}</button>
        ))}
        {flashcards.map((flashcard, index) => (
                <button onClick={() => { setRightCard(flashcard); check_correct(); }} style={buttonStyle}>{flashcard.answer}</button>
        ))}

            {/* <button onClick={handleLeftButtonClick} style={buttonStyle}>Question</button>
            <button onClick={handleLeftButtonClick} style={buttonStyle}>Answer</button> */}
          </div>
        </div>
      );
};

const buttonStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px 20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

export default App;
