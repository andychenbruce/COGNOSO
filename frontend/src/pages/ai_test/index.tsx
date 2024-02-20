import React, {
  useState,
} from "react";
import { Navbar } from "../../navbar";
import {
  Button,
  TextField,
} from "@mui/material";
import {
  ENDPOINT_AI_TEST,
  AiPromptTest
} from "../../backend_interface";
import { send_json_backend } from "../../utils";



const App: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  

  
  const submit_prompt = () => {
    let ai_send: AiPromptTest = {
      prompt: prompt,
    };
    send_json_backend(ENDPOINT_AI_TEST, JSON.stringify(ai_send))
      .then((data) => {
        console.log("result:", data);
      })
      .catch((error) => {
        console.error("Error creating card:", error);
      });
  }

  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
      <Navbar />
  
      <TextField
        label="Prompt"
        value={prompt}
        onChange={(e) => {
	  setPrompt(e.target.value);
	}}
      />
      <Button onClick={submit_prompt}
      >Create Card</Button>
    </div>
  );
};


export default App;
