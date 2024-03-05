import React from "react";
import { Navbar } from "../../navbar";
import "./home.css";
import StarIcon from "@mui/icons-material/Star";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewCarouselTwoToneIcon from "@mui/icons-material/ViewCarouselTwoTone";
const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="Favorites">
        <h2>{<StarIcon />} Favorites</h2>
        <div className="Content-box Favorites-box">{}</div>
      </div>
      <div className="Decks">
        <h2> {<ViewCarouselTwoToneIcon />}Decks</h2>
        <div className="Content-box Decks-box">{}</div>
      </div>
      <div className="OtherDecks">
        <h2> {<ViewCarouselIcon />} Decks By Other Users</h2>
        <div className="Content-box OtherDecks-box">{}</div>
      </div>
    </div>
  );
};

export default App;
