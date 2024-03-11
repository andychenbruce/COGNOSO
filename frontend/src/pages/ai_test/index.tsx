import React, { useState } from "react";
import { Navbar } from "../../navbar";
import { Button, TextField, Typography, Paper } from "@mui/material";
import { ENDPOINT_AI_TEST, AiPromptTest } from "../../backend_interface";
import { send_json_backend } from "../../utils";
import './ai_test.css';
const App: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const submitPrompt = () => {
    const aiSend: AiPromptTest = {
      prompt: prompt,
    };
    console.log('prompt:', prompt)
    send_json_backend(ENDPOINT_AI_TEST, JSON.stringify(aiSend))
      .then((data: any) => {
        setResponse(data);
      })
      .catch((error) => {
        console.error("Error talking card:", error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className='div1'>
        <Paper className = 'paper' sx={{borderRadius: '10px', backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
          <Typography variant="h4" align="center">AI Chat</Typography>
          <TextField
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            margin="normal"
            style={{borderRadius: '10px' }}
            required
            label="Ask a Question!"
            InputLabelProps={{ style: { color: "black" } }}
          />
          <Button variant="contained" onClick={submitPrompt} sx={{backgroundColor: "#9c27b0",
          "&:hover": {
            backgroundColor: "#7b1fa2",
          },}}  fullWidth>
            Submit Prompt
          </Button>
          <p style={{color: 'white'}}> *Please Note that responses may take a minute to process and generate </p>
        </Paper>
        <Paper className='paper2' sx={{borderRadius: '50px', backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
          <header>Response:</header>
            <Paper className="paper3" sx={{borderRadius: '20px', backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
              {response}
            </Paper>
        </Paper>
      </div>
    </div>
  );
};

export default App;

