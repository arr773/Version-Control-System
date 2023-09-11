import React, { useContext, useEffect, useState } from "react";
import { Paper, Grid } from "@mui/material";
import { styled } from "@mui/system";
import ScaleLoader from "react-spinners/ScaleLoader";

import { MainContext } from "../context/MainContext";

const CustomButton = styled("button")`
  font-family: IBM Plex Sans, sans-serif;
  font-weight: bold;
  font-size: 1rem;
  background-color: ${"#fff"};
  padding: 12px 24px;
  border-radius: 6px;
  color: #1976d2;
  borderwidth: 2;
  margin: 0 10px 0 0;
  text-transform: uppercase;
  border-color: #1976d2;
`;

const UserDetailsBar = () => {
  const {
    currentStatus,
    addActiveUser,
    getUserStatus,
    currentAccount,
    userDetailsLoading,
    setUserDetailsLoading,
  } = useContext(MainContext);
  const [isMounted, setIsMounted] = useState(0);

  useEffect(() => {
    if (isMounted >= 2) {
      setTimeout(() => {
        getUserStatus();
        setUserDetailsLoading(false);
      }, 10000);
    }
  }, [isMounted]);

  useEffect(() => {
    addUser();
    addUser();
  }, []);

  const addUser = async () => {
    setUserDetailsLoading(true);
    await addActiveUser();
    setIsMounted((prev) => {
      return (prev += 1);
    });
  };

  return (
    <Paper
      sx={{
        marginBottom: 2,
        paddingY: 2,
        paddingRight: 1,
        paddingLeft: 2,
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      {userDetailsLoading ? (
        <Grid container justifyContent="center" alignItems="center">
          <ScaleLoader color={"#2e3a4d"} height={40} width={10} />
        </Grid>
      ) : (
        <Grid
          container
          sx={{ maxWidth: true, justifyContent: "space-between" }}
        >
          <CustomButton disabled>
            {currentAccount.slice(0, 18) + "..."}
          </CustomButton>
          <CustomButton disabled>
            {currentStatus ? "Approver" : "Developer"}
          </CustomButton>
        </Grid>
      )}
    </Paper>
  );
};

export default UserDetailsBar;
