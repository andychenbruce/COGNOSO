import React, { useState } from 'react';

const Flashcard = ({ question, answer } : any) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div style={{ 
      border: '1px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
      width: '600px',
      height: '300px',
      textAlign: 'center',
      fontSize: '50px',
      cursor: 'pointer',
      position: 'absolute',  // or 'relative' based on your layout
                top: '400px',          // adjust the top position
                left: '600px',         // adjust the left position

    }} onClick={toggleShowAnswer}>
      {showAnswer ? (
        <p>{answer}</p>
      ) : (
        <p>{question}</p>
      )}
    </div>
  );
};

export default Flashcard;
