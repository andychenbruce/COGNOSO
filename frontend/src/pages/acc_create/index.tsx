import React from "react";
import { useState } from "react";
import { Container, Paper, TextField, Button, Typography } from "@mui/material";
import "./login.css";
import type { PageProps } from "gatsby";
import { NewUser } from "../../backend_interface";
import { send_json_backend } from "../../utils";

const Main: React.FC<PageProps> = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value, name } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user.password1 !== user.password2) {
      alert("Passwords do not match!");
      return;
    }
    let new_user_request: NewUser = {
      user_name: user.username,
      email: user.email,
      password: user.password1,
    };
    send_json_backend("/new_user", JSON.stringify(new_user_request))
      .then((data) => {
        console.log("New user made:", data);
        redirectToLogin();
        // Handle success or perform additional actions
      })
      .catch((error) => {
        console.error("Error creating new user:", error);
        // Handle error or provide user feedback
      });
  };

  const redirectToLogin = () => {
    window.location.href = "http://localhost:8000/login/";
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        style={{
          padding: 20,
          width: 300,
        }}
        elevation={3}
      >
        <Typography variant="h5" component="h1" align="center">
          Create Account
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            style={{
              marginBottom: 20,
            }}
            label="Username"
            variant="outlined"
            fullWidth
            name="username"
            value={user.username}
            onChange={handleInputChange}
            required
          />
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
            name="password1"
            value={user.password1}
            onChange={handleInputChange}
            required
          />
          <TextField
            style={{
              marginBottom: 20,
            }}
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            name="password2"
            value={user.password2}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Account
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={redirectToLogin}
          >
            Back
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Main;
