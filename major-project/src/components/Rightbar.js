import React, { useContext, useState, useEffect } from "react";
import { List, Paper, Button, Grid, Box } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";

import { middleItem } from "./constants";
import { MainContext } from "../context/MainContext";

const Rightbar = ({ setMiddleRenderItem, setActiveDocumentHash }) => {
  const { getContracts, userDetailsLoading } = useContext(MainContext);
  const [addresses, setAddresses] = useState();
  const [isListLoading, setIsListLoading] = useState(false);

  useEffect(() => {
    getAddresses();
  }, []);

  const getAddresses = async () => {
    setIsListLoading(true);
    setTimeout(async () => {
      setAddresses(await getContracts());
      setIsListLoading(false);
    }, 5000);
  };

  return (
    <Grid item xs={3}>
      <Paper
        elevation={2}
        sx={{
          minHeight: 370,
          maxHeight: 370,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          paddingX: 2,
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
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <Box fontWeight="fontWeightBold" color="primary.main" marginTop={2}>
              ALL DOCUMENT CONTRACTS
            </Box>
            {isListLoading ? (
              <Grid container justifyContent="center">
                <ScaleLoader color={"#2e3a4d"} height={40} width={10} />
              </Grid>
            ) : (
              <Paper style={{ overflow: "auto" }} elevation={0}>
                <List>
                  {addresses &&
                    addresses.map((item) => (
                      <Button
                        key={item}
                        fullWidth={true}
                        variant="outlined"
                        sx={{ marginBottom: 1 }}
                        onClick={() => {
                          setActiveDocumentHash(item);
                          setMiddleRenderItem(middleItem.contractScreen);
                        }}
                      >
                        {item.slice(0, 12) + "..."}
                      </Button>
                    ))}
                </List>
              </Paper>
            )}
            <Grid item>
              <Button
                variant="contained"
                component="label"
                sx={{ marginTop: 1 }}
                fullWidth
                onClick={() => getAddresses()}
              >
                Refresh
              </Button>
              <Box
                paddingTop={1}
                paddingLeft={1}
                paddingBottom={1}
                sx={{
                  backgroundColor: "#aaa",
                  alignSelf: "center",
                  color: "white",
                  marginTop: 1,
                  marginBottom: 2,
                  borderRadius: 1,
                }}
              >
                Select a contract to upload a new version
              </Box>
            </Grid>
          </Paper>
        )}
      </Paper>
    </Grid>
  );
};

export default Rightbar;
