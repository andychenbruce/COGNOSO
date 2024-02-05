import React, { useState } from "react";
import {
  InputBase,
  Button,
  Paper,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Navbar } from "../../navbar";

const AccountManagement: React.FC = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteButtonClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Account deleted!");
    setOpenDeleteDialog(false);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <div>
      <Navbar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh", // 100% of viewport height
        }}
      >
        <Paper
          style={{
            padding: 20,
            width: 300,
          }}
          elevation={3}
        >
          {/* Buttons wrapped in a vertical Stack */}
          <Container
            sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            {/* Delete Account Button */}
            <Button
              variant="contained"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={handleDeleteButtonClick}
            >
              Delete Account
            </Button>

            {/* Change Password Button */}
            <Button variant="contained" color="primary">
              Change Password
            </Button>

            {/* Change Username Button */}
            <Button variant="contained" color="primary">
              Change Username
            </Button>
          </Container>

          {/* Delete Confirmation Dialog */}
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
        </Paper>
      </Container>
    </div>
  );
};

export default AccountManagement;
