import React, { useContext, useEffect, useState } from "react";
import { Grid, Paper, TextField, Button, Box } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from "axios";
import IPFS from "ipfs-mini";

import { middleItem } from "../constants";
import RowItem from "./RowItem";
import { MainContext, getEthereumContract } from "../../context/MainContext";

const UploadNewVersion = ({
  activeDocumentHash,
  setActiveDocumentHash,
  setMiddleRenderItem,
}) => {
  const { getContracts, userDetailsLoading, setUserDetailsLoading } =
    useContext(MainContext);
  const [documentName, setDocumentName] = useState("");
  const [availableVersion, setAvailableVersion] = useState(0);
  const [file, setFile] = useState(null);
  const [versionMessage, setVersionMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserDetailsLoading(loading);
  }, [loading]);

  const uploadNewVersion = async () => {
    const url = "https://ipfs.infura.io:5001/api/v0/add?";
    let data = new FormData();
    for (var i = 0; i < file.length; i++) {
      data.append("file", file[i]);
    }
    data.append("versionMessage ", versionMessage);
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
            await MajorProjectContract.addNewVersion(
              response,
              availableVersion,
              activeDocumentHash
            );
            alert("New version was uploaded");
            onClear();
            await getContracts();
            setMiddleRenderItem(middleItem.contractScreen);
          }
        });
      })
      .catch((err) => console.log(err));
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    if (versionMessage !== "" && file.length !== 0) {
      setLoading(true);
      await uploadNewVersion();
      setLoading(false);
    } else {
      alert("Some fields are empty");
    }
  };

  useEffect(() => {
    getAvailableVersionDetails();
  }, [activeDocumentHash]);

  const getAvailableVersionDetails = async () => {
    setUserDetailsLoading(true);
    const MajorProjectContract = await getEthereumContract;
    const name = await MajorProjectContract.getDocumentContractName(
      activeDocumentHash
    );
    const version = await MajorProjectContract.getAvailableDocumentVersion(
      activeDocumentHash
    );
    setDocumentName(name);
    setAvailableVersion(version);
    setUserDetailsLoading(false);
  };

  const onClear = () => {
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
        {userDetailsLoading || loading ? (
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
                UPLOAD A NEW VERSION
              </Box>
              <RowItem
                rowName={"Contract name"}
                rowData={documentName || "Some random name"}
              />
              <RowItem
                rowName={"Contract address"}
                rowData={activeDocumentHash || "Some random hash"}
              />
              <RowItem
                rowName={"Available Version"}
                rowData={availableVersion.toString() || "Some random version"}
              />
              <TextField
                name="versionMessage"
                variant="outlined"
                label="Version message"
                fullWidth
                value={versionMessage}
                size="small"
                onChange={(e) => {
                  setVersionMessage(e.target.value);
                }}
                sx={{ marginBottom: 1 }}
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
                  onChange={(event) => setFile(event.target.files)}
                />
              </Button>
              <Grid container style={{ flexDirection: "row" }}>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  sx={{ flex: 1, marginRight: 0.5 }}
                  onClick={() => onClear()}
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

export default UploadNewVersion;
