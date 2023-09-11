import React, { useContext } from "react";

import MainScreen from "./MainScreen";
import ConnectToMetamask from "./ConnectToMetamask";
import { MainContext } from "../context/MainContext";

const Home = () => {
  const { appStatus } = useContext(MainContext);

  return appStatus === "connected" ? <MainScreen /> : <ConnectToMetamask />;
};

export default Home;
