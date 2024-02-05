import React, {
  useState,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
} from "react";
import { Navbar } from "../../navbar";
import { InputBase, Button } from "@mui/material";
import { UploadPdf } from "../../backend_interface";
import { send_json } from "../../utils";

const App: React.FC = () => {
  const [file, setFile]: [File | null, Dispatch<SetStateAction<File | null>>] =
    useState<File | null>(null);

  let handleChangeFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files == null) {
      console.error("missing file");
    } else {
      let input_file = event.target.files[0];
      setFile((prevFile) => {
        return input_file;
      });
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
      <p>upload pdf</p>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={handleChangeFile.bind(this)} />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          upload pdf
        </Button>
      </form>
    </div>
  );
};

export default App;
