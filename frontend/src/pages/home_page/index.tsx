import React, { useState } from 'react';
import {
  InputBase,
  Typography,
  Button,
} from '@mui/material';

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState("")
  const handlePageChange = (page: string) => {
    setSelectedPage(page);
  };

  const redirectToAcc_Manage = () => {
    window.location.href = "http://localhost:8000/acc_manage/";
  };
  const redirectToHome_Page = () => {
    window.location.href = "http://localhost:8000/home_page/";
  };
  const redirectToDeck_manage = () => {
    window.location.href = "http://localhost:8000/deck_manage/";
  };
  return (
    <div>
      <div style={{
        border: "5px solid #1976d2",
        borderRadius: "15px",
        padding: "5px",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px" 
      }}>
        <Button variant="contained" style={{ fontSize: "20px", width: "400px" }} onClick={redirectToHome_Page}>Home</Button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '500px',
          border: '2px solid #1976d2',
          borderRadius: '4px',
          padding: '5px',
        }}>
          <InputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, fontSize: "20px", paddingLeft: "10px" }}
          />
        </div>
        <Button variant="contained" style={{ fontSize: "20px", width: "400px" }} onClick={redirectToDeck_manage}>Decks</Button>
        <Button variant="contained" style={{ fontSize: "20px", width: "400px" }} onClick={redirectToAcc_Manage}>Account</Button>
      </div>
    </div>
  );
};

const Home: React.FC = () => <Typography variant="h2">Home</Typography>;

const About: React.FC = () => <Typography variant="h2">About</Typography>;

const Contact: React.FC = () => <Typography variant="h2">Contact</Typography>;

export default App;