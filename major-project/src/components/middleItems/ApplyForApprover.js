import React, { useContext, useEffect, useState } from "react";
import { Grid, Paper, Button, Box } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";

import { MainContext, getEthereumContract } from "../../context/MainContext";

const ApplyForApprover = () => {
  const { userDetailsLoading } = useContext(MainContext);
  const [approverRequestStatus, setApproverRequestStatus] = useState(false);

  useEffect(() => {
    checkApproverRequestStatus();
  }, [approverRequestStatus]);

  const checkApproverRequestStatus = async () => {
    const MajorProjectContract = await getEthereumContract;
    const requestStatus =
      await MajorProjectContract.checkForApproverRequestStatus();
    setApproverRequestStatus(requestStatus);
  };

  const applyForApprover = async (event) => {
    event.preventDefault();
    const MajorProjectContract = await getEthereumContract;
    await MajorProjectContract.applyForApprover();
    checkApproverRequestStatus();
  };

  const checkAllApproversForApprover = async (event) => {
    event.preventDefault();
    const MajorProjectContract = await getEthereumContract;
    await MajorProjectContract.checkAllApproversForApprover();
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
              APPLY FOR APPROVER
            </Box>
            {approverRequestStatus ? (
              <form
                autoComplete="off"
                fontWeight="fontWeightbold"
                noValidate
                onSubmit={(e) => {
                  checkAllApproversForApprover(e);
                }}
              >
                <Box marginBottom={2}>Check if your request was approved.</Box>
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
            ) : (
              <form
                autoComplete="off"
                fontWeight="fontWeightbold"
                noValidate
                onSubmit={(e) => {
                  applyForApprover(e);
                }}
              >
                <Box marginBottom={2}>
                  Do you wish to apply for approver privilege?
                </Box>
                <Grid container style={{ flexDirection: "row" }}>
                  <Box flex={1} marginRight={1}></Box>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    type="submit"
                    sx={{ flex: 1, marginLeft: 1 }}
                  >
                    Yes
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

export default ApplyForApprover;
