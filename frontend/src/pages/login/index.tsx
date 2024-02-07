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
        console.error("Error loggin in:", error); // Handle error or provide user feedback
      });
  };

  const redirectToacc_create = () => {
    window.location.href = "http://localhost:8000/acc_create/";
  };
  const redirectTohome_page = () => {
    window.location.href = "http://localhost:8000/home_page/";
  };
  const handleClosePopup = () => {
    setShouldShowPopup(false);
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
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
    </Container>
  );
};

export default Main;
