import React, { useContext, useState, useEffect } from "react";
import { Grid, Paper, Button, Box } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";

import RowItem from "./RowItem";
import { getEthereumContract, MainContext } from "../../context/MainContext";
import { middleItem } from "../constants";

const ContractScreen = ({ activeDocumentHash, setMiddleRenderItem }) => {
  const { userDetailsLoading, setUserDetailsLoading } = useContext(MainContext);
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    getDocumentName();
  }, [activeDocumentHash]);

  const getDocumentName = async () => {
    setUserDetailsLoading(true);
    const MajorProjectContract = await getEthereumContract;
    const name = await MajorProjectContract.getDocumentContractName(
      activeDocumentHash
    );
    setDocumentName(name);
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
            <form
              autoComplete="off"
              fontWeight="fontWeightbold"
              noValidate
              onSubmit={() => {}}
            >
              <Box marginBottom={2} marginTop={2}>
                What do you wish to do?
              </Box>
              <Grid container style={{ flexDirection: "row", marginTop: 10 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setMiddleRenderItem(middleItem.contractHashList);
                  }}
                  size="large"
                  sx={{ flex: 1, marginRight: 0.5 }}
                >
                  List versions
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ flex: 1, marginLeft: 0.5 }}
                  onClick={() => {
                    setMiddleRenderItem(middleItem.uploadNewVersion);
                  }}
                >
                  Upload New version
                </Button>
              </Grid>
            </form>
          </Paper>
        )}
      </Paper>
    </Grid>
  );
};

export default ContractScreen;
