import React, { useContext } from "react";
import { Paper, Button, Grid } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";

import { middleItem } from "./constants";
import { MainContext } from "../context/MainContext";

const Leftbar = ({ setMiddleRenderItem, middleRenderItem }) => {
  const { currentStatus, userDetailsLoading } = useContext(MainContext);
  return (
    <Grid item xs={3}>
      <Paper
        elevation={2}
        sx={{
          minHeight: 370,
          maxHeight: 370,
          display: "flex",
          justifyContent: "initial",
          flexDirection: "column",
          paddingX: 2,
        }}
      >
        {userDetailsLoading ? (
          <Grid container justifyContent="center" paddingTop={20}>
            <ScaleLoader color={"#2e3a4d"} height={40} width={10} />
          </Grid>
        ) : (
          <Grid>
            {currentStatus && (
              <Button
                fullWidth={true}
                variant="contained"
                color="primary"
                onClick={() => {
                  setMiddleRenderItem(middleItem.createDocumentContract);
                }}
                sx={{
                  marginTop: 2,
                  backgroundColor:
                    middleRenderItem !== middleItem.createDocumentContract &&
                    "#64B5F6",
                  marginBottom: 1,
                }}
              >
                Create document contract
              </Button>
            )}
            {!currentStatus && (
              <Button
                fullWidth={true}
                variant="contained"
                color="primary"
                onClick={() => {
                  setMiddleRenderItem(middleItem.applyForApprover);
                }}
                sx={{
                  backgroundColor:
                    middleRenderItem !== middleItem.applyForApprover &&
                    "#64B5F6",
                  marginBottom: 1,
                  marginTop: !currentStatus && 2,
                }}
              >
                Apply for Approver
              </Button>
            )}
            {currentStatus && (
              <Button
                fullWidth={true}
                variant="contained"
                color="primary"
                onClick={() => {
                  setMiddleRenderItem(middleItem.approveApprover);
                }}
                sx={{
                  backgroundColor:
                    middleRenderItem !== middleItem.approveApprover &&
                    "#64B5F6",
                  marginBottom: 1,
                }}
              >
                Approve new approver
              </Button>
            )}
            {currentStatus && (
              <Button
                fullWidth={true}
                variant="contained"
                color="primary"
                onClick={() => {
                  setMiddleRenderItem(middleItem.approveNewVersion);
                }}
                sx={{
                  backgroundColor:
                    middleRenderItem !== middleItem.approveNewVersion &&
                    "#64B5F6",
                }}
              >
                Approve new version
              </Button>
            )}
          </Grid>
        )}
      </Paper>
    </Grid>
  );
};

export default Leftbar;
