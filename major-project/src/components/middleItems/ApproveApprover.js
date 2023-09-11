import React, { useContext, useState } from "react";
import { Grid, Paper, Button, Box } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";

import RowItem from "./RowItem";
import { getEthereumContract, MainContext } from "../../context/MainContext";

const ApproveApprover = () => {
  const { userDetailsLoading, setUserDetailsLoading } = useContext(MainContext);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [requestAddress, setRequestAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );

  const checkForRequests = async (event) => {
    event.preventDefault();
    setUserDetailsLoading(true);
    const MajorProjectContract = await getEthereumContract;
    const pendingRequestAddress =
      await MajorProjectContract.checkForApprovals();
    if (
      pendingRequestAddress !== "0x0000000000000000000000000000000000000000"
    ) {
      setPendingRequest(true);
      setRequestAddress(pendingRequestAddress);
    } else {
      alert("No pending requests");
    }
    setUserDetailsLoading(false);
  };

  const approveApprover = async (event) => {
    event.preventDefault();
    setUserDetailsLoading(true);
    const MajorProjectContract = await getEthereumContract;
    await MajorProjectContract.approveNewApprover();
    setPendingRequest(false);
    setRequestAddress("0x0000000000000000000000000000000000000000");
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
              APPROVE NEW APPROVER
            </Box>
            {pendingRequest ? (
              <form
                autoComplete="off"
                fontWeight="fontWeightbold"
                noValidate
                onSubmit={(event) => {
                  approveApprover(event);
                }}
              >
                <Box marginBottom={2}>
                  The developer has applied to become an approver. Do you
                  consent?
                </Box>
                <RowItem
                  rowName={"Developer address"}
                  rowData={requestAddress}
                />
                <Grid container style={{ flexDirection: "row", marginTop: 10 }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {}}
                    size="large"
                    sx={{ flex: 1, marginRight: 0.5 }}
                  >
                    reject
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    type="submit"
                    sx={{ flex: 1, marginLeft: 0.5 }}
                  >
                    approve
                  </Button>
                </Grid>
              </form>
            ) : (
              <form
                autoComplete="off"
                fontWeight="fontWeightbold"
                noValidate
                onSubmit={(event) => checkForRequests(event)}
              >
                <Box marginBottom={2}>
                  Check requests by developers to become approvers
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

export default ApproveApprover;
