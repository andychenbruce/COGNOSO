import React from "react";
import { Navbar } from "../../navbar";
import "./home.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="Favorites">
        <h2>Favorites</h2>
        <div className="Content-box Favorites-box">{}</div>
      </div>
      <div className="Decks">
        <h2>Decks</h2>
        <div className="Content-box Decks-box">{}</div>
      </div>
    </div>
  );
};

export default App;
