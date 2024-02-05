import React, { useState } from 'react';
import { InputBase, Button, Paper, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


const AccountManagement: React.FC = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")

  const handleDeleteButtonClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Account deleted!');
    setOpenDeleteDialog(false);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const redirectToAcc_Manage = () => {
    window.location.href = "http://localhost:8000/acc_manage/";
  };
  const redirectToHome_Page = () => {
    window.location.href = "http://localhost:8000/home_page/";
  };
  const redirectToDeck_manage = () => {
    window.location.href = "http://localhost:8000/deck_manage/";
  };
  
  return (
    <div>
      <div>
        <div style={{
          border: "5px solid #1976d2",
          borderRadius: "15px",
          padding: "5px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px" 
        }}>
          <Button variant="contained" style={{ fontSize: "20px", width: "400px" }} onClick={redirectToHome_Page}>Home</Button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '500px',
            border: '2px solid #1976d2',
            borderRadius: '4px',
            padding: '5px',
          }}>
            <InputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, fontSize: "20px", paddingLeft: "10px" }}
            />
          </div>
          <Button variant="contained" style={{ fontSize: "20px", width: "400px" }} onClick={redirectToDeck_manage}>Decks</Button>
          <Button variant="contained" style={{ fontSize: "20px", width: "400px" }} onClick={redirectToAcc_Manage}>Account</Button>
        </div>
      </div>

      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh', // 100% of viewport height
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
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Delete Account Button */}
          <Button
            variant="contained"
            style={{ backgroundColor: 'red', color: 'white' }}
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
          <DialogTitle id="alert-dialog-title">Confirm Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} style={{ color: 'red' }} autoFocus>
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
