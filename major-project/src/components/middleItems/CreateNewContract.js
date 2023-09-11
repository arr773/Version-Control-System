import React, { useContext, useState } from "react";
import { Grid, Paper, TextField, Button, Box } from "@mui/material";
import IPFS from "ipfs-mini";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";

import RowItem from "./RowItem";
import { MainContext } from "../../context/MainContext";
import { getEthereumContract } from "../../context/MainContext";

const CreateNewContract = () => {
  const { getContracts, userDetailsLoading, setUserDetailsLoading } =
    useContext(MainContext);
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [versionMessage, setVersionMessage] = useState("");

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    if (documentName !== "" && versionMessage !== "" && file.length !== 0) {
      setUserDetailsLoading(true);
      const url = "https://ipfs.infura.io:5001/api/v0/add?";
      let data = new FormData();
      for (var i = 0; i < file.length; i++) {
        data.append("file", file[i]);
      }
      data.append("versionMessage", versionMessage);
      axios
        .post(url, data, {
          maxBodyLength: Infinity,
          headers: {
            recursive: "true",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          },
        })
        .then((res) => {
          const ipfs = new IPFS({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
          });
          ipfs.addJSON(res.data, async (err, response) => {
            if (!err) {
              const MajorProjectContract = await getEthereumContract;
              await MajorProjectContract.createNewContract(
                response,
                documentName
              );
              alert("New document contract was created");
              await getContracts();
              onClear();
              setUserDetailsLoading(false);
            }
          });
        })
        .catch((err) => console.log(err));
    } else {
      alert("Some fields are empty");
    }
  };

  const onClear = () => {
    setDocumentName("");
    setFile(null);
    setVersionMessage("");
  };

  return (
    <Grid item xs={6}>
      <Paper
        sx={{
          minHeight: 370,
          maxHeight: 370,
          display: "flex",
          flexDirection: "column",
          paddingX: 2,
          marginX: 2,
        }}
      >
        {userDetailsLoading ? (
          <Grid container justifyContent="center" paddingTop={20}>
            <ScaleLoader color={"#2e3a4d"} height={40} width={10} />
          </Grid>
        ) : (
          <form
            method="POST"
            encType="multipart/form-data"
            autoComplete="off"
            fontWeight="fontWeightbold"
            noValidate
            onSubmit={(event) => {
              handleOnSubmit(event);
            }}
          >
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                fontWeight="fontWeightBold"
                color="primary.main"
                fontSize={30}
                marginBottom={1}
                marginTop={2}
              >
                CREATE A NEW DOCUMENT CONTRACT
              </Box>
              <TextField
                name="documentName"
                variant="outlined"
                label="Contract Name"
                fullWidth
                size="small"
                value={documentName}
                onChange={(e) => {
                  setDocumentName(e.target.value);
                }}
                sx={{ marginBottom: 1 }}
                required
              />
              <RowItem rowName={"Version"} rowData={"0"} />
              <TextField
                name="versionMessage"
                variant="outlined"
                label="Version message"
                value={versionMessage}
                fullWidth
                size="small"
                onChange={(e) => setVersionMessage(e.target.value)}
                sx={{ marginBottom: 1 }}
                required
              />
              <Button
                variant="contained"
                component="label"
                sx={{ marginBottom: 1 }}
              >
                Select a file
                <input
                  type="file"
                  required
                  multiple
                  hidden
                  onChange={(e) => setFile(e.target.files)}
                />
              </Button>
              <Grid container style={{ flexDirection: "row" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onClear()}
                  size="large"
                  sx={{ flex: 1, marginRight: 0.5 }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  type="submit"
                  sx={{ flex: 1, marginLeft: 0.5 }}
                >
                  Submit
                </Button>
              </Grid>
            </Paper>
          </form>
        )}
      </Paper>
    </Grid>
  );
};

export default CreateNewContract;
