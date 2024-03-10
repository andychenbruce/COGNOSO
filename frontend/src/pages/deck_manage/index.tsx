import React, {
  Dispatch,
  useState,
  ChangeEventHandler,
  useEffect,
} from "react";
import { Navbar } from "../../navbar";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  TextField,
  Grid,
  Snackbar,
  Divider,
  DialogContent,
  FormControlLabel,
  Checkbox,
  IconButton,
  Rating,
} from "@mui/material";
import {
  ENDPOINT_LIST_CARD_DECKS,
  ENDPOINT_CREATE_CARD_DECK,
  ENDPOINT_CREATE_DECK_PDF,
  UploadPdf,ListFavoritesRequest,
  CreateCardDeck,
  DeleteCardDeck,
  ListCardDecks,
  ListCardDecksResponse,
  CardDeck,AddFavorite,
  SetDeckIcon,
  ENDPOINT_DELETE_CARD_DECK,
  ENDPOINT_SET_DECK_ICON,
  ENDPOINT_ADD_FAVORITE,
  ENDPOINT_LIST_FAVORITES,
  ListFavoritesResponse,
  ENDPOINT_DELETE_FAVORITE,
  DeleteFavorite,
  ENDPOINT_GET_RATING,
  GetRating,
} from "../../backend_interface";
import { send_json_backend, get_session_token } from "../../utils";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import {get_user_id} from "../../utils"

// testing icons
import BeachAccessTwoToneIcon from '@mui/icons-material/BeachAccessTwoTone';
import PetsTwoToneIcon from '@mui/icons-material/PetsTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import CakeTwoToneIcon from '@mui/icons-material/CakeTwoTone';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import GradeTwoToneIcon from '@mui/icons-material/GradeTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AirIcon from '@mui/icons-material/Air';
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BackHandIcon from '@mui/icons-material/BackHand';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import AllOutIcon from '@mui/icons-material/AllOut';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AlignVerticalCenterIcon from '@mui/icons-material/AlignVerticalCenter';
import AlignVerticalTopIcon from '@mui/icons-material/AlignVerticalTop';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ApiIcon from '@mui/icons-material/Api';
import AdbIcon from '@mui/icons-material/Adb';
import AccessibleIcon from '@mui/icons-material/Accessible';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import AbcIcon from '@mui/icons-material/Abc';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AirlineSeatIndividualSuiteIcon from '@mui/icons-material/AirlineSeatIndividualSuite';
import AirlinesIcon from '@mui/icons-material/Airlines';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import BoltIcon from '@mui/icons-material/Bolt';
import AttachmentIcon from '@mui/icons-material/Attachment';
import BalanceIcon from '@mui/icons-material/Balance';
import BedIcon from '@mui/icons-material/Bed';
import BuildIcon from '@mui/icons-material/Build';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import BungalowIcon from '@mui/icons-material/Bungalow';

const App: React.FC = () => {
  const iconList = [
    <BungalowIcon/>,
    <Brightness2Icon/>,
    <BuildIcon />,
    <BeachAccessTwoToneIcon />,
    <PetsTwoToneIcon />,
    <StarTwoToneIcon />,
    <CakeTwoToneIcon />,
    <HomeTwoToneIcon />,
    <GradeTwoToneIcon />,
    <AccountCircleTwoToneIcon />,
    <AcUnitIcon />,
    <AirIcon />,
    <AirlineSeatFlatIcon />,
    <AccountBalanceIcon />,
    <BackHandIcon />,
    <AddCircleOutlineIcon />,
    <AirplanemodeActiveIcon />,
    <AdsClickIcon />,
    <AirportShuttleIcon />,
    <AnnouncementIcon />,
    <AllOutIcon />,
    <AllInclusiveIcon />,
    <AlignHorizontalRightIcon />,
    <AlignVerticalBottomIcon />,
    <AlignVerticalCenterIcon />,
    <AlignVerticalTopIcon />,
    <AllInboxIcon />,
    <ApiIcon />,
    <AdbIcon />,
    <AccessibleIcon />,
    <AccessibleForwardIcon />,
    <AccessibilityIcon />,
    <AccessibilityNewIcon />,
    <AccessTimeFilledIcon />,
    <AccessTimeIcon />,
    <AccessAlarmsIcon />,
    <AbcIcon />,
    <AccountCircleIcon />,
    <AirlineSeatIndividualSuiteIcon />,
    <AirlinesIcon />,
    <AssignmentReturnedIcon />,
    <AutoStoriesIcon />,
    <BakeryDiningIcon />,
    <BeenhereIcon />,
    <BoltIcon />,
    <AttachmentIcon />,
    <BalanceIcon />,
    <BedIcon />
  ];
  
  
  const [file, setFile] = useState<File | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openIconDialog, setOpenIconDialog] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
  const [currentEditing, setCurrentEditing] = useState<number | null>(null);
  // const [ratingCurrentDeck, setratingCurrentDeck] = useState<number | null>(null);
  const [deckName, setDeckName] = useState("");
  const [usePDF, setUsePDF] = useState(false);
  const [decks, setDecks]: [CardDeck[], Dispatch<CardDeck[]>] = useState(
    [] as CardDeck[],
  );
  const [favorites, setFavorites]: [CardDeck[], Dispatch<CardDeck[]>] = useState(
    [] as CardDeck[]
  )
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [iconerrorsnackbar,changeIconErrorSnackbar] = useState(false);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchRatings = async () => {
      const newRatings: { [key: number]: number } = {};
      for (const deck of decks) {
        const rating = await getRating(deck.deck_id);
        newRatings[deck.deck_id] = rating;
      }
      setRatings(newRatings);
    };

    fetchRatings();
  }, [decks]);

  const handleIconSelectionConfirm = () => {

    let temp_deck_id = currentEditing
    if (temp_deck_id == null){
      console.error('deck_id is null')
      return;
    }
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }
    let index = selectedIcon
    if (index === null) {
      console.error('No icon selected');
      changeIconErrorSnackbar(true)
      return;
    } 
    let new_icon: SetDeckIcon = {
      access_token: access_token,
      deck_id: temp_deck_id,
      icon: index,
    };
  
    send_json_backend(ENDPOINT_SET_DECK_ICON, JSON.stringify(new_icon))
      .then(() => {
        console.log('Successfully updated deck icon');
        handleIconDialogClose();
        updateDecks();
        setSelectedIcon(null)
      })
      .catch((error) => {
        console.error('Failed to update deck icon:', error);
        changeIconErrorSnackbar(true)
      });
  };
  


  const handleIconClick = (index: number) => {
    setSelectedIcon(index);
  };

  const handleEditDeckIcon = (_deckId: number) => {
    setOpenIconDialog(true);
  };

  const updateDecks = () => {
    let token = get_session_token();
    if (token == null) {
      return;
    }
    let request1: ListCardDecks = { access_token: token };
    send_json_backend(ENDPOINT_LIST_CARD_DECKS, JSON.stringify(request1))
      .then((data: ListCardDecksResponse) => {
        setDecks(data.decks);
        // console.log(data.decks);
      })
      .catch((error) => {
        console.error("Error in:", error);
      });
    let request2: ListFavoritesRequest = {
      access_token: token
    };
    send_json_backend(ENDPOINT_LIST_FAVORITES, JSON.stringify(request2))
      .then((data: ListFavoritesResponse) => {
        // console.log('favorited', data)
        setFavorites(data.decks);
      })
      .catch((error) => {
        console.error("Error in:", error);
      });
  };

  useEffect(updateDecks, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setDeckName(value);

  };

  const handleCreateButtonClick = () => {
    setOpenCreateDialog(true);
  };

  const handleCreateConfirm = () => {
    if (deckName.trim() === "") {
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
      return;
    }
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }
    console.log("access token = ", access_token);
    let request: CreateCardDeck = {
      access_token: access_token,
      deck_name: deckName,
    };
    send_json_backend(ENDPOINT_CREATE_CARD_DECK, JSON.stringify(request))
      .then((data: null) => {
        console.log("ok: ", data);
        updateDecks();
      })
      .catch((error) => {
        console.error("Error in:", error);
      });
    setOpenCreateDialog(false);
  };

  const handleChangeFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files == null) {
      console.error("missing file");
    } else {
      let input_file = event.target.files[0];
      setFile(input_file);
    }
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
    });
  };

  const handleCheckboxChange = () => {
    setUsePDF(!usePDF);
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
  };

  const handleIconDialogClose = () => {
    setOpenIconDialog(false);
  };

  const handleCreateConfirmPDF = () => {
    if (deckName.trim() === "") {
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
      return;
    }
    if (file == null) {
      console.error("missing file");
      return;
    }
    let access_token = get_session_token();

    getBase64(file).then((base64_encode: string) => {
      if (access_token == null) {
        return;
      }
      console.log("base 64 = ", base64_encode);
      let request_json: UploadPdf = {
        access_token: access_token,
        deck_name: deckName,
        file_bytes_base64: base64_encode,
      };
      return send_json_backend(
        ENDPOINT_CREATE_DECK_PDF,
        JSON.stringify(request_json),
      )
        .then(() => {
          updateDecks();
          setOpenCreateDialog(false);
        })
        .catch((error) => {
          console.error("Error in:", error);
        });
    });
  };

  const handleDeleteDeck = (deckId: number) => {
    let access_token = get_session_token();
    if (access_token == null) {
      return;
    }
    let deleteRequest: DeleteCardDeck = {
      access_token: access_token,
      deck_id: deckId,
    };
    send_json_backend(ENDPOINT_DELETE_CARD_DECK, JSON.stringify(deleteRequest))
      .then(() => {
        updateDecks();
      })
      .catch((error) => {
        console.error("Error deleting deck:", error);
      });
  };

  const handleFavoriteDeck = (deckid: number) => {
    let access_token = get_session_token();
    let user_id = get_user_id();
    if ((access_token == null) || (user_id == null)) {
      return;
    }
    let request: AddFavorite = {
      access_token: access_token,
      user_id: user_id,
      deck_id: deckid,
    }
    send_json_backend(ENDPOINT_ADD_FAVORITE, JSON.stringify(request))
      .then(() => {
        updateDecks();
      })
      .catch((error) => {
        console.error("Error favoriting deck:", error);
      });
  }

  const handleUnfavoriteDeck = (deckId: number) => {
    let access_token = get_session_token();
    let user_id = get_user_id();
    if ((access_token == null) || (user_id == null)) {
      return;
    }
    let request: DeleteFavorite = {
      access_token: access_token,
      user_id: user_id,
      deck_id: deckId,
    };
    send_json_backend(ENDPOINT_DELETE_FAVORITE, JSON.stringify(request))
      .then(() => {
        setFavorites(favorites.filter(deck => deck.deck_id !== deckId));
      })
      .catch((error) => {
        console.error("Error unfavoriting deck:", error);
      });
  }

const getRating = async (deckid: number): Promise<number> => {
  let access_token = get_session_token();
  if (!access_token) {
    return 0;
  }
  let request: GetRating = {
    access_token: access_token,
    deck_id: deckid,
  };
  
  try {
    const data = await send_json_backend(ENDPOINT_GET_RATING, JSON.stringify(request));
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error getting rating:", error);
    return 0; // Return a default value or handle the error appropriately
  }
};

  return (
    <div>
      <Navbar />
      <Grid
        container
        rowSpacing={1}
        columnSpacing={1}
        justifyContent="flex-start"
        style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px" }}
      >
        {decks.map((deck, index) => (
          <Grid item xs={3} key={deck.deck_id}>
            <div style={{ position: "relative" }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  const url = new URL(
                    window.location.origin + "/flashcard_viewer/",
                  );
                  url.searchParams.append("deck", JSON.stringify(deck.deck_id));
                  window.location.href = url.toString();
                }}
                style={{
                  width: "100%",
                  height: "200px",
                  marginBottom: "10px",
                  backgroundColor: "#af52bf",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >

                {iconList[decks[index].icon_num]}


                <span
                  style={{
                    marginLeft: "5px",
                    textAlign: "center",
                    padding: "5px",
                    top: "60%",
                  }}
                >
                  {decks[index].name}
                </span>
              </Button>

              <IconButton
                onClick={() => handleDeleteDeck(deck.deck_id)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <DeleteIcon />
              </IconButton>

              {/* fAV STAR */}
              <IconButton
                onClick={() => {
                  if (favorites.map(x => x.deck_id).includes(deck.deck_id)) {
                    handleUnfavoriteDeck(deck.deck_id);
                  } else {
                    handleFavoriteDeck(deck.deck_id);
                  }
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                {favorites.map((x) => x.deck_id).includes(deck.deck_id) ? (
                  <StarIcon style={{ color: "yellow" }} />
                ) : (
                  <StarIcon />
                )}
              </IconButton>

              <IconButton
                onClick={() => {
                  handleEditDeckIcon(deck.deck_id);
                  setCurrentEditing(deck.deck_id);
                }}
                
                style={{
                  position: "absolute",
                  top: 0,
                  right: "20%",
                }}
              >
                <EditTwoToneIcon />
              </IconButton>
              <Rating
                name={`deck-rating-${deck.deck_id}`}
                value={ratings[deck.deck_id] || 0}
                readOnly
                size="small"
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                }}
              />
            </div>
          </Grid>
        ))}
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleCreateButtonClick}
        style={{
          width: "70px",
          height: "70px",
          fontSize: "1.5rem",
          marginTop: "10px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#af52bf",
        }}
      >
        +
      </Button>

      <Dialog
        open={openCreateDialog}
        onClose={handleCreateDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ backgroundColor: "#9370db", fontFamily: "Arial, sans-serif" }}
          id="alert-dialog-title"
        
        >
          Create New Deck
        </DialogTitle>
        <Divider style={{ backgroundColor: "#9370db" }} />
        <DialogContent style={{ backgroundColor: "#9370db" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <TextField
              style={{
                color: 'white',
                marginBottom: 20,
                borderColor: "white",
              }}
              label="Deck Name"
              variant="outlined"
              fullWidth
              name="deck_name"
              value={deckName}
              onChange={handleInputChange}
              required
            />
            <FormControlLabel
              control={
                <Checkbox checked={usePDF} onChange={handleCheckboxChange} />
              }
              label="Create from PDF"
            />
            {usePDF && (
              <>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  style={{  }}
                  sx={{border: "1px solid white", color: "white", backgroundColor: "#9c27b0",
                "&:hover": {
                  backgroundColor: "#7b1fa2",
                }}}
                >
                  Upload a file
                  <input type="file" hidden onChange={handleChangeFile} />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleCreateConfirmPDF}
                  fullWidth
                  sx={{border: "1px solid white", backgroundColor: "#9c27b0",
                  "&:hover": {
                    backgroundColor: "#7b1fa2",
                  }}}
                >
                  Confirm
                </Button>
              </>
            )}
            {!usePDF && (
              <Button
                type="submit"
                variant="contained"
                onClick={() => {
                  handleCreateConfirm();
                  setDeckName('');
                }}                
                sx={{border: "1px solid white", backgroundColor: "#9c27b0",
                "&:hover": {
                  backgroundColor: "#7b1fa2",
                }}}
                fullWidth
              >
                Confirm
              </Button>
            )}
          </div>
        </DialogContent>
        <DialogActions style={{ backgroundColor: "#9370db" }}>
          <Button
            onClick={handleCreateDialogClose}
            sx={{ border: "1px solid purple", color: "white", backgroundColor: "#7b1fa2",
            "&:hover": {
              backgroundColor: "#9c27b0",
            } }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openIconDialog}
        onClose={handleIconDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle style={{ backgroundColor: '#8916c7' }} id="alert-dialog-title">
          Choose Deck Icon
        </DialogTitle>

        <Grid container spacing={1} style={{backgroundColor: '#9370db'}}>
          {[...Array(5)].map((_, row) => (
            <Grid container item key={row} spacing={1}>
              {[...Array(12)].map((_, col) => (
                <Grid item key={row * 12 + col}>
                  <IconButton
                    onClick={() => handleIconClick(row * 12 + col)}
                    style={{
                      border: selectedIcon === row * 12 + col ? '2px solid purple' : 'none'
                    }}
                  >
                    {iconList[row * 12 + col]}
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>

        <DialogActions style={{ backgroundColor: '#9370db' }}>
          <Button

            onClick={() => handleIconSelectionConfirm()}
            style={{ backgroundColor: 'green', border: '1px solid green', color: 'white' }}
          >
            Confirm
          </Button>
          <Button
            onClick={handleIconDialogClose}
            style={{ backgroundColor: 'red', border: '1px solid white', color: 'white' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={null}
        onClose={() => setSnackbarOpen(false)}
        message="Title cannot be empty!"
      ></Snackbar>


{/* FIX SOON */}
      <Snackbar
        open={iconerrorsnackbar}
        autoHideDuration={null}
        onClose={() => changeIconErrorSnackbar(false)}
        message="Error Changing Icon!"
      ></Snackbar>
      
    </div>
  );
};

export default App;
