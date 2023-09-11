import { useContext } from "react";
import { Avatar, Button, Grid } from "@mui/material";
import metamask from "../assets/metamask.png";
import { MainContext } from "../context/MainContext";

const ConnectToMetamask = () => {
  const { connectToWallet } = useContext(MainContext);
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{
        minHeight: "100vh",
        paddingTop: 200,
        backgroundColor: "#2e3a4d",
      }}
    >
      <Avatar
        sx={{ width: 200, height: 200, marginBottom: 2 }}
        src={metamask}
      />
      <Button
        size="large"
        variant="contained"
        component="label"
        sx={{ fontSize: 20, fontWeight: "bold" }}
        onClick={() => {
          connectToWallet();
        }}
      >
        Connect To Wallet
      </Button>
    </Grid>
  );
};

export default ConnectToMetamask;
