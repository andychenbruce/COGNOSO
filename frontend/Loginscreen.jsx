import { useContext, useState } from 'react';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

// Got most stuff here from Prof's authenticated Book example

const LoginScreen = () => {
  const { updateUser } = useContext(UserContext);
  const [user, setUser] = useState({ email: '', password: ''});
  const history = useNavigate();

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      email: user.email,
      password: user.password,
    };
    fetch('http://localhost:3010/v0/login', {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
    .then((json) => {
      updateUser(json);
      localStorage.setItem('data', JSON.stringify(json));
      history('/home');
    })
    .catch((err) => {
      alert('Error logging in, please try again', err);
      return;
    });
  };

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <Paper
        style={{
          padding: 20,
          width: 300,
        }}
        elevation={3}>
        <Typography variant="h5" component="h1" align="center">
          Login
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            style={{
              marginBottom: 20,
            }}
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            style={{
              marginBottom: 20,
            }}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            value={user.password}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginScreen;