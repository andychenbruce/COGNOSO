import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  CssBaseline,
  Paper,
} from '@mui/material';

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('home');

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
  };

  return (
    <>
      <CssBaseline />
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              style={{ cursor: 'pointer' }}
              onClick={() => handlePageChange('home')}
            >
              My App
            </Typography>
            <Button
              color="inherit"
              onClick={() => handlePageChange('about')}
              disabled={selectedPage === 'about'}
            >
              About
            </Button>
            <Button
              color="inherit"
              onClick={() => handlePageChange('contact')}
              disabled={selectedPage === 'contact'}
            >
              Contact
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          {selectedPage === 'home' && <Home />}
          {selectedPage === 'about' && <About />}
          {selectedPage === 'contact' && <Contact />}
        </Paper>
      </Container>
    </>
  );
};

const Home: React.FC = () => <Typography variant="h2">Home</Typography>;

const About: React.FC = () => <Typography variant="h2">About</Typography>;

const Contact: React.FC = () => <Typography variant="h2">Contact</Typography>;

export default App;