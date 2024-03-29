// This file is used for the account creation page. It manages 4 textfields and two buttons (used MUI).
// It checks if the user has input the same password twice but does NOT validate whether the input in the email section is actucally an email
// If successful, the account creation page should rerout to the login page with the backend having saved the user's credentials
// Otherwise, the user will be prompted that something is wrong with their credentials (i.e passwords dont match)

import React from "react";
import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
} from "@mui/material";
import "./acc_create.css";
import type { PageProps } from "gatsby";
import { ENDPOINT_NEW_USER, NewUser } from "../../backend_interface";
import { send_json_backend } from "../../utils";

const acc_create: React.FC<PageProps> = () => {
  const [passwordMismatch, setPasswordMismatch] = useState(false);
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
      setPasswordMismatch(true);
      return;
    }
    const new_user_request: NewUser = {
      user_name: user.username,
      email: user.email,
      password: user.password1,
    };
    send_json_backend<NewUser, null>(ENDPOINT_NEW_USER, new_user_request).then(
      () => {
        redirectToLogin();
      },
    );
  };

  const redirectToLogin = () => {
    window.location.pathname = "/login/";
  };

  const handleClosePopup = () => {
    setPasswordMismatch(false);
  };

  return (
    <div className="acc_create">
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
            backgroundColor: "#c993ed",
          }}
          elevation={3}
        >
          <Typography variant="h5" component="h1" align="center">
            Create Account
          </Typography>
          <p> </p>
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ backgroundColor: "#4d1a7f", color: "white" }}
            >
              Create Account
            </Button>
            <p> </p>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={redirectToLogin}
              style={{ backgroundColor: "#4d1a7f", color: "white" }}
            >
              Back
            </Button>
          </form>
          <Snackbar
            open={passwordMismatch}
            autoHideDuration={3000}
            onClose={handleClosePopup}
            message="Passwords Do Not Match!"
          />
        </Paper>
      </Container>
    </div>
  );
};

export default acc_create;
