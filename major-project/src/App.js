import React, { useContext } from "react";

import { MainContext } from "./context/MainContext";
import Home from "./components/Home";
import Loader from "./components/Loader";

function App() {
  const { loading } = useContext(MainContext);
  return loading ? <Loader /> : <Home />;
}

export default App;
