import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginScreen from "./pages/Login/Login"
import FlashcardViewerFunc from "./pages/FlashcardViewer/App"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen/>} />
	<Route path="/flashcard_viewer" element={<FlashcardViewerFunc/>} />
      </Routes>
    </BrowserRouter>
  );
}

// ReactDOM.render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
//   document.getElementById("root")
// );


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
