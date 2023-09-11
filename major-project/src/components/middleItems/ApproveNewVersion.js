import React, { useState, useEffect, useContext } from "react";
import { Grid, Paper, Button, Box } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from "axios";

import RowItem from "./RowItem";
import { getEthereumContract, MainContext } from "../../context/MainContext";

const ApproveNewVersion = () => {
  const { userDetailsLoading, setUserDetailsLoading } = useContext(MainContext);
  const [isPendingRequest, setIsPendingRequest] = useState(false);
  const [pendingRequest, setPendingRequest] = useState({
    documentName: "",
    documentAddress: "",
    pendingVersionMessage: "",
    pendingVersionVersion: 0,
    pendingVersionHash: "",
  });
  const [filesForDownload, setFilesForDownload] = useState([]);

  useEffect(() => {
    if (pendingRequest.pendingVersionHash) {
      getPendingNewVersionDetails(pendingRequest.pendingVersionHash);
      setIsPendingRequest(true);
    }
  }, [pendingRequest.pendingVersionHash]);

  const checkForApproveNewVersion = async (event) => {
    setUserDetailsLoading(true);
    event.preventDefault();
    setUserDetailsLoading(true);
    const MajorProjectContract = await getEthereumContract;
    const pendingReq = await MajorProjectContract.checkForApproveNewVersion();
    setPendingRequest({
      ...pendingRequest,
      documentName: pendingReq.documentName,
      documentAddress: pendingReq.documentAddress,
      pendingVersionHash: pendingReq.pendingVersionHash,
      pendingVersionVersion: parseInt(
        pendingReq.pendingVersionVersion._hex,
        16
      ),
    });
    pendingRequest.pendingVersionHash &&
      getPendingNewVersionDetails(pendingReq.pendingVersionHash);
    if (pendingReq.pendingVersionHash === "") {
      alert("No pending versions to be approved");
    }
    setUserDetailsLoading(false);
  };

  const approvePendingNewVersion = async (event) => {
    event.preventDefault();
    setUserDetailsLoading(true);
    const MajorProjectContract = await getEthereumContract;
    await MajorProjectContract.approvePendingHash();
    alert("New version has been approved");
    setIsPendingRequest(false);
    setUserDetailsLoading(false);
  };

  const getPendingNewVersionDetails = async (documentHash) => {
    const url = "https://ipfs.infura.io/ipfs/";
    const response = await axios.get(url + documentHash, {
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
        setPendingRequest({
          ...pendingRequest,
          pendingVersionMessage: message.data,
        });
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
              APPROVE NEW VERSION
            </Box>
            {isPendingRequest ? (
              <form
                autoComplete="off"
                fontWeight="fontWeightbold"
                noValidate
                onSubmit={(event) => approvePendingNewVersion(event)}
              >
                <RowItem
                  rowName={"Contract name"}
                  rowData={pendingRequest.documentName || "Some random name"}
                />
                <RowItem
                  rowName={"Contract address"}
                  rowData={pendingRequest.documentAddress || "Some random hash"}
                />
                <RowItem
                  rowName={"Version"}
                  rowData={
                    pendingRequest.pendingVersionVersion ||
                    "Some random version"
                  }
                />
                <RowItem
                  rowName={"Version message"}
                  rowData={
                    pendingRequest.pendingVersionMessage ||
                    "Some random version message"
                  }
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
                <Grid container style={{ flexDirection: "row" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {}}
                    size="large"
                    sx={{ flex: 1, marginRight: 0.5 }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    type="submit"
                    sx={{ flex: 1, marginLeft: 0.5 }}
                  >
                    Approve
                  </Button>
                </Grid>
              </form>
            ) : (
              <form
                autoComplete="off"
                fontWeight="fontWeightbold"
                noValidate
                onSubmit={(event) => checkForApproveNewVersion(event)}
              >
                <Box marginBottom={2}>Check pending new version requests</Box>
                <Grid container style={{ flexDirection: "row" }}>
                  <Box flex={1} marginRight={1}></Box>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    type="submit"
                    sx={{ flex: 1, marginLeft: 1 }}
                  >
                    Check
                  </Button>
                </Grid>
              </form>
            )}
          </Paper>
        )}
      </Paper>
    </Grid>
  );
};

export default ApproveNewVersion;
