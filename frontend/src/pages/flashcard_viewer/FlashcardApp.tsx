import React, { useState } from "react";
import Flashcard from "./Flashcard"; // Adjust the import path based on your project structure

const FlashcardApp = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  const addFlashcard = () => {
    if (frontText && backText) {
      const newFlashcard = { front: frontText, back: backText };
      setFlashcards([...flashcards, newFlashcard] as any);
      setFrontText("");
      setBackText("");
    }

    //   let new_user_request: ListCards = {
    //     user_name: user.username,
    //     email: user.email,
    //     password: user.password1,
    //   };
    //   send_json_backend("/new_user", JSON.stringify(new_user_request))
    //     .then((data) => {
    //       console.log("New user made:", data);
    //       redirectToLogin();
    //     })
    //     .catch((error) => {
    //       console.error("Error creating new user:", error);
    //     });
    // };
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

      {flashcards.map((flashcard: any, index) => (
        <Flashcard key={index} front={flashcard.front} back={flashcard.back} />
      ))}
    </div>
  );
};

export default FlashcardApp;
