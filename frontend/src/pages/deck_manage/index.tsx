import React, { Dispatch, useState, ChangeEventHandler, useEffect } from "react";
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
} from "@mui/material";
import {
  UploadPdf,
  CreateCardDeck,
  ListCardDecks,
  ListCardDecksResponse,
  CardDeck,
} from "../../backend_interface";
import { send_json_backend, get_session_token } from "../../utils";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [usePDF, setUsePDF] = useState(false);
  const [decks, setDecks]: [CardDeck[], Dispatch<CardDeck[]>] = useState([] as CardDeck[]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorField, setTextFieldError] = useState(false);

  const updateDecks = () => {
    let token = get_session_token();
    if (token == null) {
      return;
    }
    let request: ListCardDecks = { access_token: token };
    send_json_backend("/list_card_decks", JSON.stringify(request))
      .then((data: ListCardDecksResponse) => {
        setDecks(data.decks);
        console.log(data.decks);
      })
      .catch((error) => {
        console.error("Error in:", error);
      });
  };

  useEffect(updateDecks, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    setDeckName(value);
    setTextFieldError(false);
  };

  const handleCreateButtonClick = () => {
    setOpenCreateDialog(true);
  };

  const handleCreateConfirm = () => {
    if (deckName.trim() === "") {
      setSnackbarOpen(true);
      setTextFieldError(true);
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
    send_json_backend("/create_card_deck", JSON.stringify(request))
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

  const handleCreateConfirmPDF = () => {
    if (deckName.trim() === "") {
      setSnackbarOpen(true);
      setTextFieldError(true);
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
        deck_id: 123, //todo
        file_bytes_base64: base64_encode,
      };
      return send_json_backend(
        "/create_card_deck_pdf",
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

  return (
    <div>
      <Navbar />
      <Grid
        container
        rowSpacing={1}
        columnSpacing={1}
        justifyContent="flex-start"
        style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px"}}
      >
        {decks.map((deck, index) => (
          <Grid item xs={3} key={deck.deck_id} >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                const url = new URL(
                  window.location.origin + "/flashcard_viewer/",
                );
                url.searchParams.append(
                  "deck",
                  JSON.stringify(deck.deck_id),
                );
                window.location.href = url.toString();
              }}
              style={{
                width: "100%",
                height: "70px",
                fontSize: "1.5rem",
                marginBottom: "10px",
              }}
            >
              {decks[index].name}
            </Button>
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
          marginLeft: "auto",
          marginRight: "30px",
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
        <DialogTitle style={{ backgroundColor: "#9370db" }} id="alert-dialog-title">
          Create New Deck
        </DialogTitle>
        <Divider style={{ backgroundColor: "#9370db" }} />
        <DialogContent style={{ backgroundColor: "#9370db" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TextField
              style={{ marginBottom: 20, borderColor: errorField ? "red" : undefined }}
              label="Deck Name"
              variant="outlined"
              fullWidth
              name="deck_name"
              value={deckName}
              onChange={handleInputChange}
              required
            />
            <FormControlLabel
              control={<Checkbox checked={usePDF} onChange={handleCheckboxChange} />}
              label="Create from PDF"
            />
            {usePDF && (
              <>
                <Button variant="contained" component="label" fullWidth style={{ border: '1px solid white', color: 'white' }}>
                  Upload a file
                  <input type="file" hidden onChange={handleChangeFile} />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={handleCreateConfirmPDF}
                  color="primary"
                  fullWidth
                >
                  Confirm
                </Button>
              </>
            )}
            {!usePDF && (
              <Button
                type="submit"
                variant="contained"
                onClick={handleCreateConfirm}
                color="primary"
                fullWidth
              >
                Confirm
              </Button>
            )}
          </div>
        </DialogContent>
        <DialogActions style={{ backgroundColor: "#9370db" }}>
          <Button onClick={handleCreateDialogClose} style={{ border: '1px solid white', color: 'white' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={null}
        onClose={() => setSnackbarOpen(false)}
        message="Title cannot be empty!"
      >
      </Snackbar>
    </div>
  );
};

export default App;
