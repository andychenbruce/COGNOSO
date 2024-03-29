//this file has the flashcard interface

import React, { useState } from "react";
import "./Flashcard.css";

export interface FlashcardInfo {
  front: string;
  back: string;
}

const Flashcard = ({ front, back }: FlashcardInfo) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div
      className={`flashcard ${showAnswer ? "flipped" : ""}`} // Toggle the "flipped" class
      onClick={toggleShowAnswer}
    >
      <div className="card">
        <div className="front">
          <div className="flashcard-content">{front}</div>
        </div>
        <div className="back">
          <div className="flashcard-content">{back}</div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
