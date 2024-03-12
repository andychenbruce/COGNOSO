//login page
//uses two buttons and two textfields.
//utilizes states for user inputs and sends info to backend for verification
//if credentials are correct, login reroutes to home page
// if credentials are incorrect, a popup will appear stating such
// if user does not fill either or any textfields, a popup will appear stating that empty textfield is required
// if user name is correct but password is wrong, error will say such
// if user name does not exist, error will say such

import React from "react";
import { useState, Dispatch } from "react";
import { Paper, TextField, Button, Snackbar } from "@mui/material";
import "./login.css";
import type { PageProps } from "gatsby";
import {
  ENDPOINT_LOGIN,
  LoginRequest,
  LoginResponse,
} from "../../backend_interface";
import { send_json_backend, set_session_info } from "../../utils";

const Main: React.FC<PageProps> = () => {
  const [user, setUser]: [LoginRequest, Dispatch<LoginRequest>] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = ( //saves state that textfields are currently in
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value, name } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => { //when user presses enter or login, sends info to backend for verification of credentials
    event.preventDefault();
    send_json_backend<LoginRequest, LoginResponse>(ENDPOINT_LOGIN, user)
      .then((data: LoginResponse) => {
        set_session_info(data.access_token, data.user_id);
        redirectTohome_page();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const redirectToacc_create = () => { //redirect to acc creation page
    window.location.pathname = "/acc_create/";
  };
  const redirectTohome_page = () => { //after login success, redirect to home page
    window.location.pathname = "/home_page/";
  };
  const handleClosePopup = () => { //handles bottom left popup for any errors that may occur
    setErrorMessage(null);
  };

  const HeaderText = () => {
    return (
      <div className="header">
        <h1>Welcome to Cognoso</h1>
        <p>Learn to Learn.</p>
      </div>
    );
  };

  return (
    <div className="login">
      <HeaderText />
      <div className="container">
        <Paper
          style={{
            padding: "20px",
            width: 300,
            backgroundColor: "#c993ed",
          }}
          elevation={3}
        >
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
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#4d1a7f", color: "white" }}
              fullWidth
            >
              Login
            </Button>
            <p> </p>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#4d1a7f", color: "white" }}
              fullWidth
              onClick={redirectToacc_create}
            >
              Create Account
            </Button>
          </form>
          <Snackbar
            open={errorMessage != null}
            autoHideDuration={3000}
            onClose={handleClosePopup}
            message={"Login failed: " + errorMessage}
          />
        </Paper>
      </div>
    </div>
  );
};

export default Main;
