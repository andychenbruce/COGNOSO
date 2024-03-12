import React from "react";
import { Button } from "@mui/material";
import { redirect } from "../../utils";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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
        <AddCircleOutlineIcon/>
        <span>Add New Deck</span>
      </Button>
    </div>
  );
};

export default DummyDeck;
