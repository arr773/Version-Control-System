import React, { useState, useEffect, useContext } from "react";
import { Grid, Paper, Button, Box } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from "axios";

import RowItem from "./RowItem";
import { getEthereumContract, MainContext } from "../../context/MainContext";

const ApproveNewVersion = ({
  activeDocumentHash,
  activeVersionHash,
  activeVersionNumber,
}) => {
  const { userDetailsLoading, setUserDetailsLoading } = useContext(MainContext);
  const [documentName, setDocumentName] = useState("");
  const [versionMessage, setVersionMessage] = useState("");
  const [filesForDownload, setFilesForDownload] = useState([]);

  useEffect(() => {
    getDocumentName();
    getPendingNewVersionDetails();
  }, []);

  const getDocumentName = async () => {
    setUserDetailsLoading(true);
    const MajorProjectContract = await getEthereumContract;
    const name = await MajorProjectContract.getDocumentContractName(
      activeDocumentHash
    );
    setDocumentName(name);
  };

  const getPendingNewVersionDetails = async () => {
    const url = "https://ipfs.infura.io/ipfs/";
    const response = await axios.get(url + activeVersionHash, {
      "Content-Type": `multipart/form-data`,
    });
    const dataArray = response.data.split(/\r?\n/);
    dataArray.pop();
    const filesPaths = [];
    for (var i = 0; i < dataArray.length; i++) {
      const item = dataArray[i];
      const data = await JSON.parse(item);

      if (data.Name === data.Hash) {
        const message = await axios.get(url + data.Hash, {
          "Content-Type": `multipart/form-data`,
        });
        setVersionMessage(message.data);
      } else {
        const file = {
          hash: data.Hash,
          name: data.Name,
        };
        filesPaths.push(file);
      }
    }
    setFilesForDownload(filesPaths);
    setUserDetailsLoading(false);
  };

  const forceDownload = (blob, filename) => {
    var a = document.createElement("a");
    a.download = filename;
    a.href = blob;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const onDownload = (event) => {
    event.preventDefault();
    const url = "https://ipfs.infura.io/ipfs/";
    for (var i = 0; i < filesForDownload.length; i++) {
      const fileForDownload = filesForDownload[i];
      fetch(url + filesForDownload[i].hash, {
        headers: new Headers({
          Origin: window.location.origin,
        }),
        mode: "cors",
      })
        .then((response) => response.blob())
        .then((blob) => {
          let blobUrl = window.URL.createObjectURL(blob);
          forceDownload(blobUrl, fileForDownload.name);
        })
        .catch((err) => console.log(err));
    }
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
              DOWNLOAD VERSION
            </Box>
            <form autoComplete="off" fontWeight="fontWeightbold" noValidate>
              <RowItem
                rowName={"Contract name"}
                rowData={documentName || "Some random name"}
              />
              <RowItem
                rowName={"Contract hash"}
                rowData={activeDocumentHash || "Some random hash"}
              />
              <RowItem
                rowName={"Version"}
                rowData={activeVersionNumber || "Some random version"}
              />
              <RowItem
                rowName={"Version message"}
                rowData={versionMessage || "Some random version message"}
              />
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ marginBottom: 1 }}
                onClick={(event) => onDownload(event)}
              >
                Download File
                <input type="file" hidden />
              </Button>
            </form>
          </Paper>
        )}
      </Paper>
    </Grid>
  );
};

export default ApproveNewVersion;
