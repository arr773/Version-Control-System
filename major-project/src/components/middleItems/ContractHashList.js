import React, { useContext, useState, useEffect } from "react";
import { Grid, Paper, Button, Box, List } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from "axios";

import RowItem from "./RowItem";
import { getEthereumContract, MainContext } from "../../context/MainContext";
import { middleItem } from "../constants";

const ContractHashList = ({
  activeDocumentHash,
  setMiddleRenderItem,
  setActiveVersionHash,
  setActiveVersionNumber,
}) => {
  const { userDetailsLoading, setUserDetailsLoading } = useContext(MainContext);
  const [documentName, setDocumentName] = useState("");
  const [versionList, setVersionList] = useState([]);

  useEffect(() => {
    getDocumentName();
    getListOfVersions();
  }, []);

  const getDocumentName = async () => {
    setUserDetailsLoading(true);
    const MajorProjectContract = await getEthereumContract;
    const name = await MajorProjectContract.getDocumentContractName(
      activeDocumentHash
    );
    setDocumentName(name);
  };

  const getVersionMessageHash = async (dataArray) => {
    for (var i = 0; i < dataArray.length; i++) {
      const innerItem = dataArray[i];
      const data = await JSON.parse(innerItem);
      if (data.Name === data.Hash) {
        return data.Hash;
      }
    }
  };

  const getListOfVersions = async () => {
    const MajorProjectContract = await getEthereumContract;
    const versionHashes = await MajorProjectContract.getDocumentHashes(
      activeDocumentHash
    );
    const versionObjects = [];
    const url = "https://ipfs.infura.io/ipfs/";
    for (var i = 0; i < versionHashes.length; i++) {
      const item = versionHashes[i];
      const response = await axios.get(url + item, {
        "Content-Type": `multipart/form-data`,
      });
      const dataArray = response.data.split(/\r?\n/);
      dataArray.pop();
      versionObjects.push(await getVersionMessageHash(dataArray));
    }
    const versions = [];
    for (var j = 0; j < versionObjects.length; j++) {
      const item = versionObjects[j];
      const response = await axios.get(url + item, {
        "Content-Type": `multipart/form-data`,
      });
      const versionItem = {
        versionHash: versionHashes[j],
        versionMessage: response.data,
      };
      versions.push(versionItem);
    }
    setVersionList(versions);
    setUserDetailsLoading(false);
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
              minHeight: 370,
              maxHeight: 370,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              fontWeight="fontWeightBold"
              color="primary.main"
              fontSize={30}
              marginBottom={2}
              marginTop={2}
            >
              {documentName}
            </Box>
            <RowItem
              rowName={"Document Address"}
              rowData={activeDocumentHash}
            />
            <Paper style={{ overflow: "auto" }} elevation={0}>
              <List>
                {versionList &&
                  versionList.map((item, index) => (
                    <Button
                      key={item.versionHash}
                      fullWidth
                      color="info"
                      variant="contained"
                      sx={{ marginBottom: 1, justifyContent: "flex-start" }}
                      onClick={() => {
                        setActiveVersionHash(item.versionHash);
                        setMiddleRenderItem(middleItem.downloadVersionFiles);
                        setActiveVersionNumber(index + 1);
                      }}
                    >
                      {index + 1 + ". " + item.versionMessage.slice()}
                    </Button>
                  ))}
              </List>
            </Paper>
            <Box paddingBottom={2}></Box>
          </Paper>
        )}
      </Paper>
    </Grid>
  );
};

export default ContractHashList;
