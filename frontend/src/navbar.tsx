import React, { useState, Dispatch } from "react";
import {
  Button,
  InputBase,
  Menu,
  Snackbar,
  MenuItem,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  ListItemText,
  DialogContentText,
} from "@mui/material";
import { redirect, send_json_backend } from "./utils";
import {
  ENDPOINT_DELETE_USER,
  DeleteUser,
  ENDPOINT_CHANGE_PASSWORD,
  ChangePassword,
} from "./backend_interface";
import { logout } from "./utils";
import HomeIcon from "@mui/icons-material/Home";
import BackupTableOutlinedIcon from "@mui/icons-material/BackupTableOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ChatIcon from "@mui/icons-material/Chat";
// import logo from './../../assets/logo.png';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState(""); //state of whats in search bar
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); //dropdown bar to anchor at 'account' button
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); //popup for account deletion
  const [openPassChangeDialog, setOpenPassChangeDialog] = useState(false); //popup for password change
  const [ChangePassError, setChangePassError] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [errorFields2, setErrorFields2] = useState<string[]>([]);
  const [showPassChangeSuccessSnackbar, setshowPassChangeSuccessSnackbar] =
    useState(false);
  const [showDeleteErrorSnackbar, setShowDeleteErrorSnackbar] = useState(false);
  const [showDeleteSuccessSnackbar, setshowDeleteSuccessSnackbar] =
    useState(false);
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

  // menu popup for change pass, logout and delete acc
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //Stuff for account deletion
  const handleDeleteButtonClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    const deleteUserRequest: DeleteUser = {
      email: user.email,
      password: user.password,
    };
    send_json_backend<DeleteUser, null>(ENDPOINT_DELETE_USER, deleteUserRequest)
      .then(() => {
        setshowDeleteSuccessSnackbar(true);
        logout();
        window.location.pathname = "/login/";
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setErrorFields2(["email", "password"]);
        setTimeout(() => setErrorFields2([]), 2000);
        setShowDeleteErrorSnackbar(true);
      });
  };

  // stuff for pass change
  const handleChangePassDialog = () => {
    setOpenPassChangeDialog(true);
  };

  const handleChanegPassDialogClose = () => {
    setOpenPassChangeDialog(false);
  };

  const PassChangeNotSame = () => {
    setChangePassError(false);
  };

  const handleChangePass = () => {
    const changePassRequest: ChangePassword = {
      email: user.email2,
      old_password: user.pass1,
      new_password: user.pass2,
    };
    send_json_backend<ChangePassword, null>(
      ENDPOINT_CHANGE_PASSWORD,
      changePassRequest,
    )
      .then(() => {
        handleChanegPassDialogClose();
        setshowPassChangeSuccessSnackbar(true);
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        setErrorFields(["email2", "pass1", "pass2"]);
        setTimeout(() => setErrorFields([]), 2000);
        setChangePassError(true);
      });
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
      {/* IMAGEHERE OF LOGO */}
      <HomeButton />
      <SearchBar
	searchQuery={searchQuery}
	setSearchQuery={setSearchQuery}
      />
      
      <DecksButton />
      <AiButton />
      <AccountButton
	handleMenuOpen={handleMenuOpen}
      />
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
            width: "250px",
            backgroundColor: "#9370db",
          },
        }}
      >
	<LogoutButton />

        <ChangePasswordButton
	  handleChangePassDialog={handleChangePassDialog}
	/>

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

      {/* DELETE ACCOUNT SECTION */}

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ background: "#140952a6", color: "white" }}
          id="alert-dialog-title"
        >
          Confirm Delete Account
        </DialogTitle>
        <DialogContent style={{ background: "#140952a6" }}>
          <DialogContentText
            style={{ color: "white" }}
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
              borderColor: errorFields2.includes("email") ? "red" : undefined,
            }}
            error={errorFields2.includes("email")}
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
              borderColor: errorFields2.includes("password")
                ? "red"
                : undefined,
            }}
            error={errorFields2.includes("password")}
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

      {/* Change Password Section */}

      <Dialog
        open={openPassChangeDialog}
        onClose={handleChanegPassDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
              color: "white",
              "&:hover": {
                backgroundColor: "#7b1fa2",
              },
            }}
            autoFocus
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={ChangePassError}
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


const LogoutButton = () => (
  <MenuItem
    onClick={() => {
      sessionStorage.clear();
      window.location.pathname = "/login/";
    }
    }
    sx={{
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "#7b1fa2",
      },
    }}
  >
    <ListItemText primary="Log Out" sx={{ color: "white" }} />
  </MenuItem>
);

const ChangePasswordButton = ({handleChangePassDialog} : {handleChangePassDialog: () => void}) => (
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
);
  

const HomeButton = () => (
  <Button
    variant="contained"
    sx={{
      fontSize: "20px",
      width: "250px",
      backgroundColor: "#9c27b0",
      "&:hover": {
        backgroundColor: "#7b1fa2",
      },
    }}
    onClick={() => {
      redirect("/home_page", []);
    }}
  >
    <HomeIcon />
    Home
  </Button>
);

const SearchBar = ({searchQuery, setSearchQuery} : {searchQuery: string, setSearchQuery: Dispatch<string>}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      width: "400px",
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
          redirect("/search_results/", [
            ["query", JSON.stringify(searchQuery)],
          ]);
        }
      }}
    />
  </div>


);

const DecksButton = () => (
  <Button
    variant="contained"
    sx={{
      fontSize: "20px",
      width: "250px",
      backgroundColor: "#9c27b0",
      "&:hover": {
        backgroundColor: "#7b1fa2",
      },
    }}
    onClick={() => {
      redirect("/deck_manage", []);
    }}
  >
    <BackupTableOutlinedIcon />
    Decks
  </Button>
);


const AiButton = () => (
  <Button
    variant="contained"
    sx={{
      fontSize: "20px",
      width: "250px",
      backgroundColor: "#9c27b0",
      "&:hover": {
        backgroundColor: "#7b1fa2",
      },
    }}
    onClick={() => {
      redirect("/ai_test", []);
    }}
  >
    <ChatIcon />
    Ai Chat
  </Button>
);

const AccountButton = ({handleMenuOpen} : {handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void}) => (
  <Button
    variant="contained"
    sx={{
      fontSize: "20px",
      width: "250px",
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
)
