import React from "react";
import { Grid, Button, TextField } from "@mui/material";

const RowItem = ({ rowName, rowData }) => {
  return (
    <Grid container sx={{ paddingBottom: 1 }}>
      <Button
        disabled={true}
        variant="outlined"
        color="secondary"
        onClick={(e) => {}}
        size="small"
        sx={{ flex: 2, paddingX: 0 }}
      >
        {rowName}
      </Button>
      <TextField
        disabled
        label={rowData}
        fullWidth
        size="small"
        onChange={(e) => {}}
        sx={{ flex: 3, marginLeft: 1, color: "black" }}
      ></TextField>
    </Grid>
  );
};

export default RowItem;
