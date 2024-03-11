import React from "react";
import { Button } from "@mui/material";
import { redirect } from "../../utils";

const DummyDeck = () => {
  return (
    <div style={{ marginRight: "10px" }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => redirect("/deck_manage", [])}
        sx={{
          width: "200px",
          height: "200px",
          marginBottom: "10px",
          backgroundColor: "#f50057",
          "&:hover": {
            backgroundColor: "#ab003c",
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span>Add New Deck</span>
      </Button>
    </div>
  );
};

export default DummyDeck;
