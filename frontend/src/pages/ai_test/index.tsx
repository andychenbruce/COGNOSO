import React, { useState } from "react";
import { Navbar } from "../../navbar";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
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
    send_json_backend(ENDPOINT_AI_TEST, JSON.stringify(aiSend))
      .then((data: string) => {
        const responseData = JSON.parse(data);
        setResponse(responseData.content);
      })
      .catch((error) => {
        console.error("Error creating card:", error);
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

        </Paper>
        <Paper className='paper2' sx={{borderRadius: '50px', backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
          <header>Response:</header>
            <Paper className="paper3" sx={{borderRadius: '20px', backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
              {response && (
                <Box mt={2}>
                  <Typography variant="body1" align="center" style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '4px' }}>
                    {response}
                  </Typography>
                </Box>
              )}
            </Paper>
        </Paper>
      </div>
    </div>
  );
};

export default App;

