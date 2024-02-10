import {
  Button,
  Paper,
  Typography,
  InputBase,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { redirect } from "./utils";

export const Navbar = () => {
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
        onClick={() => {
          redirect("/home_page");
        }}
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
        onClick={() => {
          redirect("/deck_manage");
        }}
      >
        Decks
      </Button>
      <Button
        variant="contained"
        style={{ fontSize: "20px", width: "400px" }}
        onClick={() => {
          redirect("/acc_manage");
        }}
      >
        Account
      </Button>
    </div>
  );
};
