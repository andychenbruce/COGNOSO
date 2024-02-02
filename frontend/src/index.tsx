import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginScreen from "./pages/Login/Login"
import FlashcardViewerFunc from "./pages/FlashcardViewer/App"
import Homepage from "./pages/Homepage/Homepage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen/>} />
	<Route path="/flashcard_viewer" element={<FlashcardViewerFunc/>} />
	<Route path="/" element={<Homepage/>} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
