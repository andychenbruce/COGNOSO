import React, { useState } from "react";
import "./Flashcard.css";

const Flashcard = ({ question, answer }: any) => {
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
          <p>{question}</p>
        </div>
        <div className="back">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
