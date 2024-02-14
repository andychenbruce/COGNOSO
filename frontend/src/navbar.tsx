import React, { useState } from "react";
import { Button, InputBase, Menu, MenuItem, Container, Dialog, Paper, DialogContent, DialogTitle, DialogActions, DialogContentText} from "@mui/material";
import { redirect } from "./utils";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteButtonClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Account deletion initiated!");
    const deleteUserRequest = {
        email: 'test', 
        password: 'test', 
    };

    fetch('/delete_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteUserRequest),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete user.');
        }
        console.log("Account deleted successfully!"); 
        })
    .catch(error => {
        console.error('Error deleting user:', error);
    });
};

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleLogOut = () => {
    sessionStorage.clear()
    window.location.pathname = "/login/"
  }

  return (
    <div
      style={{
        border: "5px solid #1976d2",
        borderRadius: "15px",
        padding: "5px",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <Button
        variant="contained"
        style={{ fontSize: "20px", width: "400px" }}
        onClick={() => {
          redirect("/home_page");
        }}
      >
        Home
      </Button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "500px",
          border: "2px solid #1976d2",
          borderRadius: "4px",
          padding: "5px",
        }}
      >
        <InputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, fontSize: "20px", paddingLeft: "10px" }}
        />
      </div>
      <Button
        variant="contained"
        style={{ fontSize: "20px", width: "400px" }}
        onClick={() => { redirect("/deck_manage"); }}
      >
        Decks
      </Button>
      <Button
        variant="contained"
        style={{ fontSize: "20px", width: "400px" }}
        onClick={handleMenuOpen}
      >
        Account
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
          <Container
            sx={{ display: "flex", flexDirection: "column", gap: "8px"}}
          >
            <Button variant="contained" color="primary" onClick={handleLogOut}>
              Log Out
            </Button>
            <Button variant="contained" color="primary">
              Change Password
            </Button>

            <Button variant="contained" color="primary">
              Change Username
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={handleDeleteButtonClick}
            >
              Delete Account
            </Button>
          </Container>
          <Dialog
            open={openDeleteDialog}
            onClose={handleDeleteDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Confirm Delete Account
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                style={{ color: "red" }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>


      </Menu>
    </div>
  );
};
