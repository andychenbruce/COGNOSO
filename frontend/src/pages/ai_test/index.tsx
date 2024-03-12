// This file is the ai chat page.
// All user made prompt submitted will be sent to backend and will take at most a minute to process before producing a response
// The response will then be sent back here, where it will be loaded onto the page in the response box

import React, { useState } from "react";
import { Navbar } from "../../navbar";
import { Button, TextField, Typography, Paper } from "@mui/material";
import { ENDPOINT_AI_TEST, AiPromptTest } from "../../backend_interface";
import { send_json_backend } from "../../utils";
import "./ai_test.css";
const App: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const submitPrompt = () => { //sends users prompt to backend
    const aiSend: AiPromptTest = {
      prompt: prompt,
    };
    send_json_backend<AiPromptTest, string>(ENDPOINT_AI_TEST, aiSend).then(
      (data: string) => {
        setResponse(data);
      },
    );
  };

  //this function submits a user's prompt when the 'enter' key is pressed
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      submitPrompt();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="div1">
        <Paper
          className="paper"
          sx={{
            borderRadius: "10px",
            backgroundColor: "rgba(128, 128, 128, 0.5)",
          }}
        >
          <Typography variant="h4" align="center">
            AI Chat
          </Typography>
          <TextField
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            margin="normal"
            style={{ borderRadius: "10px" }}
            required
            label="Ask a Question!"
            InputLabelProps={{ style: { color: "black" } }}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            onClick={submitPrompt}
            
            sx={{
              backgroundColor: "#9c27b0",
              "&:hover": {
                backgroundColor: "#7b1fa2",
              },
            }}
            fullWidth
          >
            Submit Prompt
          </Button>
          <p style={{ color: "white" }}>
            {" "}
            *Please use correct punctuation for best results
            {" "}
            </p>
            <p style={{ color: "white" }}>
            *Please Note that responses may take a minute to process and
            generate
            {" "}
          </p>
        </Paper>
        <Paper
          className="paper2"
          sx={{
            borderRadius: "50px",
            backgroundColor: "rgba(128, 128, 128, 0.5)",
          }}
        >
          <header>Response:</header>
          <Paper
            className="paper3"
            sx={{
              borderRadius: "20px",
              backgroundColor: "rgba(128, 128, 128, 0.5)",
            }}
          >
            {response}
          </Paper>
        </Paper>
      </div>
    </div>
  );
};

export default App;
