import React, { useState } from "react";
import {Button,  InputBase,  Menu,  Snackbar,  MenuItem,Dialog,  TextField,  DialogContent,  DialogTitle,  DialogActions,  ListItemText,  DialogContentText,} from "@mui/material";
import { redirect, send_json_backend } from "./utils";
import { ENDPOINT_DELETE_USER, DeleteUser } from "./backend_interface";
import { ENDPOINT_CHANGE_PASSWORD, ChangePassword } from "./backend_interface";
import { logout } from "./utils";
import HomeIcon from "@mui/icons-material/Home";
import BackupTableOutlinedIcon from "@mui/icons-material/BackupTableOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPassChangeDialog, setOpenPassChangeDialog] = useState(false);
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [showPassChangeSuccessSnackbar, setshowPassChangeSuccessSnackbar] = useState(false);
  const [showDeleteErrorSnackbar, setShowDeleteErrorSnackbar] = useState(false);
  const [showDeleteSuccessSnackbar, setshowDeleteSuccessSnackbar] = useState(false);
  
  const [user, setUser] = useState({
    email: "",
    password: "",
    email2: "",
    pass1: "",
    pass2: "",
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteButtonClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    console.log("Account deletion initiated!");
    const deleteUserRequest: DeleteUser = {
      email: user.email,
      password: user.password,
    };
    send_json_backend(
      ENDPOINT_DELETE_USER,
      JSON.stringify(deleteUserRequest),
    )      
    .then(() => {
      console.log("User deleted successfully.");
      console.log("Logging out...");
      setshowDeleteSuccessSnackbar(true);
      logout();
      window.location.pathname = "/login/";
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      setShowDeleteErrorSnackbar(true);
    });

  };

  const handleChangePassDialog = () => {
    setOpenPassChangeDialog(true);
  };

  const handleChanegPassDialogClose = () => {
    setOpenPassChangeDialog(false);
  };

  const handleChangePass = () => {
    const changePassRequest: ChangePassword = {
      email: user.email2,
      old_password: user.pass1,
      new_password: user.pass2,
    };
    send_json_backend(
      ENDPOINT_CHANGE_PASSWORD,
      JSON.stringify(changePassRequest),
    )
      .then(() => {
        console.log("success!");
        handleChanegPassDialogClose();
        setshowPassChangeSuccessSnackbar(true);
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        setErrorFields(["email2", "pass1", "pass2"]);
        setTimeout(() => setErrorFields([]), 2000);
        setShouldShowPopup(true);
      });
  };

  const handleLogOut = () => {
    sessionStorage.clear();
    window.location.pathname = "/login/";
  };

  const PassChangeNotSame = () => {
    setShouldShowPopup(false);
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(128, 128, 128, 0.5)",
        border: "5px solid #ab47bc",
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
        sx={{
          fontSize: "20px",
          width: "400px",
          backgroundColor: "#9c27b0",
          "&:hover": {
            backgroundColor: "#7b1fa2",
          },
        }}
        onClick={() => {
          redirect("/home_page");
        }}
      >
        <HomeIcon />
        Home
      </Button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "500px",
          border: "2px solid #9c27b0",
          borderRadius: "4px",
          padding: "5px",
        }}
      >
        <InputBase
          placeholder="Search…"
          startAdornment={<SearchOutlinedIcon />}
          inputProps={{ "aria-label": "search", style: { color: "#E6E6FA" } }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, fontSize: "20px", paddingLeft: "10px" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const url = new URL(window.location.origin + "/search_results/");
              url.searchParams.append("query", JSON.stringify(searchQuery));
              window.location.href = url.toString();
            }
          }}
        />
      </div>
      <Button
        variant="contained"
        sx={{
          fontSize: "20px",
          width: "400px",
          backgroundColor: "#9c27b0",
          "&:hover": {
            backgroundColor: "#7b1fa2",
          },
        }}
        onClick={() => {
          redirect("/deck_manage");
        }}
      >
        <BackupTableOutlinedIcon />
        Decks
      </Button>
      <Button
        variant="contained"
        sx={{
          fontSize: "20px",
          width: "400px",
          backgroundColor: "#9c27b0",
          "&:hover": {
            backgroundColor: "#7b1fa2",
          },
        }}
        onClick={handleMenuOpen}
      >
        <Person2OutlinedIcon />
        Account
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#9370db",
          },
        }}
      >
        <MenuItem
          onClick={handleLogOut}
          sx={{
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "#7b1fa2",
            },
          }}
        >
          <ListItemText primary="Log Out" sx={{ color: "white" }} />
        </MenuItem>

        <MenuItem
          onClick={handleChangePassDialog}
          sx={{
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "#7b1fa2",
            },
          }}
        >
          <ListItemText primary="Change Password" sx={{ color: "white" }} />
        </MenuItem>

        <MenuItem
          onClick={handleDeleteButtonClick}
          sx={{
            backgroundColor: "red",
            border: "1px solid black",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          }}
        >
          <ListItemText primary="Delete Account" sx={{ color: "white" }} />
        </MenuItem>
      </Menu>
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ background: "#140952a6", color: "#E6E6FA" }}
          id="alert-dialog-title"
        >
          Confirm Delete Account
        </DialogTitle>
        <DialogContent style={{ background: "#140952a6" }}>
          <DialogContentText
            style={{ color: "#E6E6FA" }}
            id="alert-dialog-description"
          >
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ background: "#140952a6" }}>
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
            InputLabelProps={{ style: { color: "#E6E6FA" } }}
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
            InputLabelProps={{ style: { color: "#E6E6FA" } }}
          />
          <Button
            onClick={handleDeleteDialogClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#7b1fa2",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              color: "red",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openPassChangeDialog}
        onClose={handleChanegPassDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          ".MuiDialog-paper": {
            background: "linear-gradient(to left, #140952a6, #22032e)",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ background: "#140952a6", color: "white" }}
        >
          Change Password
        </DialogTitle>
        <DialogContent style={{ background: "#140952a6" }}>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "white" }}
          >
            Please enter your Email, Old Password and New Password
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ background: "#140952a6" }}>
          <TextField
            style={{
              marginBottom: 20,
              borderColor: errorFields.includes("email2") ? "red" : undefined,
            }}
            error={errorFields.includes("email2")}
            label="Email"
            variant="outlined"
            fullWidth
            name="email2"
            value={user.email2}
            onChange={handleInputChange}
            required
            InputLabelProps={{ style: { color: "#E6E6FA" } }}
          />
          <TextField
            style={{
              marginBottom: 20,
              borderColor: errorFields.includes("pass1") ? "red" : undefined,
            }}
            error={errorFields.includes("pass1")}
            label="Old Password"
            type="password"
            variant="outlined"
            fullWidth
            name="pass1"
            value={user.pass1}
            onChange={handleInputChange}
            required
            InputLabelProps={{ style: { color: "#E6E6FA" } }}
          />
          <TextField
            style={{
              marginBottom: 20,
              borderColor: errorFields.includes("pass2") ? "red" : undefined,
            }}
            error={errorFields.includes("pass2")}
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            name="pass2"
            value={user.pass2}
            onChange={handleInputChange}
            required
            InputLabelProps={{ style: { color: "#E6E6FA" } }}
          />
          <Button
            onClick={handleChanegPassDialogClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#7b1fa2",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangePass}
            sx={{
              color: "#90EE90",
              "&:hover": {
                backgroundColor: "#4caf50",
              },
            }}
            autoFocus
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={shouldShowPopup}
        autoHideDuration={3000}
        onClose={PassChangeNotSame}
        message="Password Change Failed!"
      />
      <Snackbar
        open={showPassChangeSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setshowPassChangeSuccessSnackbar(false)}
        message="Password Successfully Changed!"
      />
      <Snackbar
        open={showDeleteErrorSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowDeleteErrorSnackbar(false)}
        message="Delete Account Failed!"
      />
      <Snackbar
        open={showDeleteSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setshowDeleteSuccessSnackbar(false)}
        message="Delete Account Successfull!"
      />
    </div>
  );
};
