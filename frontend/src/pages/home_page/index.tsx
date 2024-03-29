import React, { Dispatch, useState, useEffect } from "react";
import { Navbar } from "../../navbar";
import "./home.css";
import { send_json_backend, get_session_token, redirect } from "../../utils";
import {
  ListCardDecks,
  ListCardDecksResponse,
  CardDeck,
  ENDPOINT_LIST_FAVORITES,
  ListFavoritesRequest,
  ListFavoritesResponse,
  ENDPOINT_LIST_CARD_DECKS,
  ENDPOINT_GET_RANDOM_DECKS,
  RandomDecksRequest,
  RandomDecksResponse,
} from "../../backend_interface";
import DummyDeck from "./dummydeck";
import { Button, Rating } from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewCarouselTwoToneIcon from "@mui/icons-material/ViewCarouselTwoTone";
import BeachAccessTwoToneIcon from "@mui/icons-material/BeachAccessTwoTone";
import PetsTwoToneIcon from "@mui/icons-material/PetsTwoTone";
import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";
import CakeTwoToneIcon from "@mui/icons-material/CakeTwoTone";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import GradeTwoToneIcon from "@mui/icons-material/GradeTwoTone";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import AirlineSeatFlatIcon from "@mui/icons-material/AirlineSeatFlat";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BackHandIcon from "@mui/icons-material/BackHand";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AllOutIcon from "@mui/icons-material/AllOut";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import AlignVerticalTopIcon from "@mui/icons-material/AlignVerticalTop";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import ApiIcon from "@mui/icons-material/Api";
import AdbIcon from "@mui/icons-material/Adb";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import AbcIcon from "@mui/icons-material/Abc";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AirlineSeatIndividualSuiteIcon from "@mui/icons-material/AirlineSeatIndividualSuite";
import AirlinesIcon from "@mui/icons-material/Airlines";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import BoltIcon from "@mui/icons-material/Bolt";
import AttachmentIcon from "@mui/icons-material/Attachment";
import BalanceIcon from "@mui/icons-material/Balance";
import BedIcon from "@mui/icons-material/Bed";
import BuildIcon from "@mui/icons-material/Build";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import BungalowIcon from "@mui/icons-material/Bungalow";

const home_page: React.FC = () => {
  const iconList = [
    <BungalowIcon />,
    <Brightness2Icon />,
    <BuildIcon />,
    <BeachAccessTwoToneIcon />,
    <PetsTwoToneIcon />,
    <StarTwoToneIcon />,
    <CakeTwoToneIcon />,
    <HomeTwoToneIcon />,
    <GradeTwoToneIcon />,
    <AccountCircleTwoToneIcon />,
    <AcUnitIcon />,
    <AirIcon />,
    <AirlineSeatFlatIcon />,
    <AccountBalanceIcon />,
    <BackHandIcon />,
    <AddCircleOutlineIcon />,
    <AirplanemodeActiveIcon />,
    <AdsClickIcon />,
    <AirportShuttleIcon />,
    <AnnouncementIcon />,
    <AllOutIcon />,
    <AllInclusiveIcon />,
    <AlignHorizontalRightIcon />,
    <AlignVerticalBottomIcon />,
    <AlignVerticalCenterIcon />,
    <AlignVerticalTopIcon />,
    <AllInboxIcon />,
    <ApiIcon />,
    <AdbIcon />,
    <AccessibleIcon />,
    <AccessibleForwardIcon />,
    <AccessibilityIcon />,
    <AccessibilityNewIcon />,
    <AccessTimeFilledIcon />,
    <AccessTimeIcon />,
    <AccessAlarmsIcon />,
    <AbcIcon />,
    <AccountCircleIcon />,
    <AirlineSeatIndividualSuiteIcon />,
    <AirlinesIcon />,
    <AssignmentReturnedIcon />,
    <AutoStoriesIcon />,
    <BakeryDiningIcon />,
    <BeenhereIcon />,
    <BoltIcon />,
    <AttachmentIcon />,
    <BalanceIcon />,
    <BedIcon />,
  ];
  const [decks, setDecks]: [CardDeck[], Dispatch<CardDeck[]>] = useState(
    [] as CardDeck[],
  );
  const updateDecks = () => {
    const token = get_session_token();
    if (token == null) {
      return;
    }
    const request1: ListCardDecks = { access_token: token };
    send_json_backend<ListCardDecks, ListCardDecksResponse>(
      ENDPOINT_LIST_CARD_DECKS,
      request1,
    ).then((data: ListCardDecksResponse) => {
      setDecks(data.decks);
    });
    const request2: ListFavoritesRequest = {
      access_token: token,
    };
    send_json_backend<ListFavoritesRequest, ListFavoritesResponse>(
      ENDPOINT_LIST_FAVORITES,
      request2,
    ).then((data: ListFavoritesResponse) => {
      setFavorites(data.decks);
    });
    const randNum = 10;
    const request3: RandomDecksRequest = {
      num_decks: randNum,
    };
    send_json_backend<RandomDecksRequest, RandomDecksResponse>(
      ENDPOINT_GET_RANDOM_DECKS,
      request3,
    ).then((data: RandomDecksResponse) => {
      setRandomDecks(data.decks);
    });
  };

  const [favorites, setFavorites]: [CardDeck[], Dispatch<CardDeck[]>] =
    useState([] as CardDeck[]); //saves favorite decks to be displayed when page is updated

  useEffect(updateDecks, []);

  const [randomdecks, setRandomDecks]: [CardDeck[], Dispatch<CardDeck[]>] =
    useState([] as CardDeck[]); //saves randomly selected decks to be displayed when page is updated

  return (
    <div>
      <Navbar />

      {/* Favorites */}
      <div className="Favorites">
        <h2>{<StarIcon />} Favorites</h2>
        <div className="Content-box Favorites-box">
          <div className="deckAreaBackground">
            {favorites.length > 0 ? (
              favorites.map((deck, index) => (
                <div key={deck.deck_id} style={{ marginRight: "10px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      redirect("/flashcard_viewer/", [
                        ["deck", JSON.stringify(deck.deck_id)],
                        ["user", JSON.stringify(deck.user_id)],
                      ]);
                    }}
                    className="button_sx"
                    sx={{
                      width: "200px",
                      height: "200px",
                      marginBottom: "10px",
                      backgroundColor: "#9c27b0",
                      "&:hover": {
                        backgroundColor: "#7b1fa2",
                      },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {iconList[favorites[index].icon_num]}
                    <Rating
                      name={`deck-rating-${deck.deck_id}`}
                      value={deck.rating}
                      readOnly
                      size="small"
                      style={{
                        position: "absolute",
                        bottom: 10,
                        left: 10,
                      }}
                    />
                    <span className="span_style">{deck.name}</span>
                  </Button>
                </div>
              ))
            ) : (
              <DummyDeck />
            )}
          </div>
        </div>
      </div>
      {/* ---------------- My Decks AREA ---------------*/}
      <div className="Decks">
        <h2>{<ViewCarouselTwoToneIcon />} My Decks</h2>
        <div className="Content-box Decks-box">
          <div className="deckAreaBackground">
            {decks.length > 0 ? (
              decks.map((deck, index) => (
                <div key={deck.deck_id} style={{ marginRight: "10px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      redirect("/flashcard_viewer/", [
                        ["deck", JSON.stringify(deck.deck_id)],
                        ["user", JSON.stringify(deck.user_id)],
                      ]);
                    }}
                    sx={{
                      width: "200px",
                      height: "200px",
                      marginBottom: "10px",
                      backgroundColor: "#9c27b0",
                      "&:hover": {
                        backgroundColor: "#7b1fa2",
                      },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {iconList[decks[index].icon_num]}
                    <Rating
                      name={`deck-rating-${deck.deck_id}`}
                      value={deck.rating}
                      readOnly
                      size="small"
                      style={{
                        position: "absolute",
                        bottom: 10,
                        left: 10,
                      }}
                    />
                    <span className="span_style">{deck.name}</span>
                  </Button>
                </div>
              ))
            ) : (
              <DummyDeck />
            )}
          </div>
        </div>
      </div>
      {/* ---------------- Other Decks AREA ---------------*/}
      <div className="OtherDecks">
        <h2>{<ViewCarouselIcon />} Decks By Other Users</h2>
        <div className="Content-box OtherDecks-box">
          <div className="deckAreaBackground">
            {randomdecks.length > 0 ? (
              randomdecks.map((deck, index) => (
                <div key={deck.deck_id} style={{ marginRight: "10px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      redirect("/flashcard_viewer/", [
                        ["deck", JSON.stringify(deck.deck_id)],
                        ["user", JSON.stringify(deck.user_id)],
                      ]);
                    }}
                    sx={{
                      width: "200px",
                      height: "200px",
                      marginBottom: "10px",
                      backgroundColor: "#9c27b0",
                      "&:hover": {
                        backgroundColor: "#7b1fa2",
                      },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {iconList[randomdecks[index].icon_num]}
                    <Rating
                      name={`deck-rating-${deck.deck_id}`}
                      value={deck.rating}
                      readOnly
                      size="small"
                      style={{
                        position: "absolute",
                        bottom: 10,
                        left: 10,
                      }}
                    />
                    <span className="span_style">{deck.name}</span>
                  </Button>
                </div>
              ))
            ) : (
              <DummyDeck />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default home_page;
