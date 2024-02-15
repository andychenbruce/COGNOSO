import React from "react";
import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
} from "@mui/material";
import "./login.css";
import type { PageProps } from "gatsby";
import { LoginRequest, LoginResponse } from "../../backend_interface";
import { send_json_backend, set_session_token } from "../../utils";

const Main: React.FC<PageProps> = () => {
  const [user, setUser]: [LoginRequest, any] = useState({
    email: "",
    password: "",
  });
  const [shouldShowPopup, setShouldShowPopup] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value, name } = event.target;
    setUser((prevUser: LoginRequest) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send_json_backend("/login", JSON.stringify(user))
      .then((data: LoginResponse) => {
        set_session_token(data.access_token);
        console.log("got back json: ", data);
        redirectTohome_page();
      })
      .catch((error) => {
        console.error("Error loggin in:", error);
        setShouldShowPopup(true);
      });
  };

  const redirectToacc_create = () => {
    window.location.pathname = "/acc_create/";
  };
  const redirectTohome_page = () => {
    window.location.pathname = "/home_page/";
  };
  const handleClosePopup = () => {
    setShouldShowPopup(false);
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
            padding: "20px", // Adjusted padding to make the login area smaller
            width: 300,
            backgroundColor: "#c993ed",
          }}
          elevation={3}
        >
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
            {/* <Button type="submit" variant="text" color="primary" fullWidth>
            Forgot Password?
          </Button> */}
          </form>
          <Snackbar
            open={shouldShowPopup}
            autoHideDuration={3000}
            onClose={handleClosePopup}
            message="Login failed. Please try again."
          />
        </Paper>
      </div>
    </div>
  );
};

export default Main;
