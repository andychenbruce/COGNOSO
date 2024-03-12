//This file is the search results page
//It uses the search bar to send a request to the backend and display the correct decks
import React, { useState, Dispatch, useEffect } from "react";
import { Navbar } from "../../navbar";
import "./search_results.css";

import { Grid } from "@mui/material";
import { send_json_backend, redirect } from "../../utils";
import {
  CardDeck,
  ENDPOINT_SEARCH_DECKS,
  SearchDecksRequest,
  SearchDecksResponse,
} from "../../backend_interface";
import { Button, Rating } from "@mui/material";

// testing icons
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

const App: React.FC = () => {
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
  const [query, setQuery]: [string, Dispatch<string>] = useState("");

  useEffect(() => {
    //Gets the query from the search bar and sends it to the backend to get the results
    const urlString = window.location.href;
    const url = new URL(urlString);
    const searchParams = new URLSearchParams(url.search);
    const queryJSON = searchParams.get("query");
    const query = queryJSON ? JSON.parse(queryJSON) : null;
    if (query == null) {
      return;
    }
    setQuery(query);

    const request: SearchDecksRequest = {
      prompt: query,
    };
    send_json_backend<SearchDecksRequest, SearchDecksResponse>(
      ENDPOINT_SEARCH_DECKS,
      request,
    ).then((data: SearchDecksResponse) => {
      const temp = [];
      for (let i = 0; i < data.decks.length; i++) {
        if (data.decks[i].name == query) {
          temp.push(data.decks[i]);
        }
      }
      setDecks(data.decks);
    });
  }, []);

  return (
    //displays the results in the same format as the homepage
    <div className="App">
      <div>
        <Navbar />
        <h1 className="HeaderOne"> Search Results for: {query}</h1>

        <div className="mainbody">
          <div className="Content-box">
            <Grid
              container
              spacing={1}
              sx={{ backgroundColor: "rgba(128, 128, 128, 0.5)" }}
            >
              {decks.map((deck, index) => (
                <Grid item xs={4} sm={3} md={2} lg={1} key={deck.deck_id}>
                  <div style={{ padding: "10px", display: "flex" }}>
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
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        backgroundColor: "#af52bf",
                        "&:hover": {
                          backgroundColor: "#7b1fa2",
                        },
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
                      <span
                        style={{
                          marginLeft: "5px",
                          textAlign: "center",
                          padding: "5px",
                          top: "60%",
                          width: "100px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {deck.name}
                      </span>
                    </Button>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
