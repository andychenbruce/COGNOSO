import React, { useState, Dispatch } from "react";
import Flashcard, { FlashcardInfo } from "./Flashcard";

const FlashcardApp = () => {
  const [flashcards, setFlashcards]: [FlashcardInfo[], Dispatch<FlashcardInfo[]>] = useState([] as FlashcardInfo[]);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  const addFlashcard = () => {
    if (frontText && backText) {
      const newFlashcard = { front: frontText, back: backText };
      setFlashcards([...flashcards, newFlashcard]);
      setFrontText("");
      setBackText("");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label>
          Front:
          <input
            type="text"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
          />
        </label>
        <label>
          Back:
          <input
            type="text"
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
          />
        </label>
        <button onClick={addFlashcard}>Add Flashcard</button>
      </div>

      {flashcards.map((flashcard: FlashcardInfo, index) => (
        <Flashcard key={index} front={flashcard.front} back={flashcard.back} />
      ))}
    </div>
  );
};

export default FlashcardApp;
