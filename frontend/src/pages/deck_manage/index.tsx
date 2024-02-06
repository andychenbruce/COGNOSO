import React, { useState, ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { Navbar } from "../../navbar";
import { Dialog, Button, DialogTitle, DialogActions } from "@mui/material";
import { UploadPdf } from "../../backend_interface";
import { send_json } from "../../utils";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleCreateButtonClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCreateConfirm = () => {
    console.log("Account deleted!");
    setOpenDeleteDialog(false);
  };

  const handleCreateDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleChangeFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files == null) {
      console.error("missing file");
    } else {
      let input_file = event.target.files[0];
      setFile(input_file);
    }
  };

  function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
    });
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file == null) {
      console.error("missing file");
      return;
    }

    getBase64(file).then((base64_encode: string) => {
      let request_json: UploadPdf = {
        access_token: [123, 456], //todo
        deck_id: 123, //todo
        file_bytes_base64: base64_encode,
      };
      return send_json("/upload_pdf", JSON.stringify(request_json));
    });
  };

  return (
    <div>
      <Navbar />
      <Button type="submit" variant="contained" color="primary" onClick={handleCreateButtonClick}>
        +
      </Button>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCreateDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Select a Set creation method:</DialogTitle>
        <DialogActions>
          <Button type="submit" variant="contained" onClick={handleCreateConfirm} color="primary" fullWidth>
            Create Your Own!
          </Button>

          <Button variant="contained" component="label" fullWidth>
            Upload File
            <input type="file" hidden onChange={handleChangeFile} />
          </Button>

          <Button onClick={handleCreateDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;

