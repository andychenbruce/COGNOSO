import React from 'react';
import { useState } from 'react';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import './login.css';
import type { PageProps } from "gatsby"

const Main: React.FC<PageProps>  = () => {
  const [user, setUser] = useState({ email: '', password: ''});
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value, name } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  //const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //  console.log("bruh");
    // event.preventDefault();
    // const requestData = {
    //   email: user.email,
    //   password: user.password,
    // };
    // fetch('http://localhost:3010/v0/login', {
    //   method: 'POST',
    //   body: JSON.stringify(requestData),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    // .then((res) => res.json())
    // .then((json) => {
    //   updateUser(json);
    //   localStorage.setItem('data', JSON.stringify(json));
    //   history('/home');
    // })
    // .catch((err) => {
    //   alert('Error logging in, please try again', err);
    //   return;
    // });
  //};

  const newUser = {
    user_name: "pooman",
    email: "person@qq.com",
    passwd_hash: [12, 34, 56, 255]
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch('http://localhost:3000/new_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
    .then(response => response.json())
    .then(data => {
      console.log('New user created:', data);
      // Handle success or perform additional actions
    })
    .catch(error => {
      console.error('Error creating new user:', error);
      // Handle error or provide user feedback
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Account
          </Button>
          <Button type="submit" variant="text" color="primary" fullWidth>
            Forgot Password?
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Main;
