import {
  Button,
  Paper,
  Typography,
  InputBase,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";

export const Navbar = () => {
  const redirectToAcc_Manage = () => {
    window.location.href = "http://localhost:8000/acc_manage/";
  };
  const redirectToHome_Page = () => {
    window.location.href = "http://localhost:8000/home_page/";
  };
  const redirectToDeck_manage = () => {
    window.location.href = "http://localhost:8000/deck_manage/";
  };

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div
      style={{
        border: "5px solid #1976d2",
        borderRadius: "15px",
        padding: "5px",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <Button
        variant="contained"
        style={{ fontSize: "20px", width: "400px" }}
        onClick={redirectToHome_Page}
      >
        Home
      </Button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "500px",
          border: "2px solid #1976d2",
          borderRadius: "4px",
          padding: "5px",
        }}
      >
        <InputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, fontSize: "20px", paddingLeft: "10px" }}
        />
      </div>
      <Button
        variant="contained"
        style={{ fontSize: "20px", width: "400px" }}
        onClick={redirectToDeck_manage}
      >
        Decks
      </Button>
      <Button
        variant="contained"
        style={{ fontSize: "20px", width: "400px" }}
        onClick={redirectToAcc_Manage}
      >
        Account
      </Button>
    </div>
  );
};
