import React from "react";
import { Grid } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";

const Loader = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{
        minHeight: "100vh",
        paddingTop: 300,
        backgroundColor: "#2e3a4d",
      }}
    >
      <ScaleLoader color="#fff" height={100} width={10} />
    </Grid>
  );
};

export default Loader;
