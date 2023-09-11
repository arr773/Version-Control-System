import React, { useContext, useState, useEffect } from "react";
import { Grid } from "@mui/material";

import { middleItem } from "./constants";
import UserDetailsBar from "./UserDetailsBar";
import Leftbar from "./Leftbar";
import Rightbar from "./Rightbar";
import UploadNewVersion from "./middleItems/UploadNewVersion";
import ApproveNewVersion from "./middleItems/ApproveNewVersion";
import CreateNewContract from "./middleItems/CreateNewContract";
import ApplyForApprover from "./middleItems/ApplyForApprover";
import ApproveApprover from "./middleItems/ApproveApprover";
import ContractScreen from "./middleItems/ContractScreen";
import ContractHashList from "./middleItems/ContractHashList";
import DownloadVersionFiles from "./middleItems/DownloadVersionFiles";
import { MainContext } from "../context/MainContext";

const MainScreen = () => {
  const { currentStatus } = useContext(MainContext);
  const [middleRenderItem, setMiddleRenderItem] = useState(
    middleItem.applyForApprover
  );
  const [activeDocumentHash, setActiveDocumentHash] = useState("");
  const [activeVersionHash, setActiveVersionHash] = useState("");
  const [activeVersionNumber, setActiveVersionNumber] = useState(0);

  useEffect(() => {
    setMiddleRenderItem(
      currentStatus
        ? middleItem.createDocumentContract
        : middleItem.applyForApprover
    );
  }, [currentStatus]);

  const renderMiddleItem = () => {
    switch (middleRenderItem) {
      case middleItem.uploadNewVersion:
        return (
          <UploadNewVersion
            activeDocumentHash={activeDocumentHash}
            setActiveDocumentHash={setActiveDocumentHash}
            setMiddleRenderItem={setMiddleRenderItem}
          />
        );
      case middleItem.applyForApprover:
        return <ApplyForApprover />;
      case middleItem.createDocumentContract:
        return <CreateNewContract />;
      case middleItem.approveApprover:
        return <ApproveApprover />;
      case middleItem.approveNewVersion:
        return <ApproveNewVersion />;
      case middleItem.contractScreen:
        return (
          <ContractScreen
            setMiddleRenderItem={setMiddleRenderItem}
            activeDocumentHash={activeDocumentHash}
          />
        );
      case middleItem.contractHashList:
        return (
          <ContractHashList
            setMiddleRenderItem={setMiddleRenderItem}
            activeDocumentHash={activeDocumentHash}
            setActiveVersionHash={setActiveVersionHash}
            setActiveVersionNumber={setActiveVersionNumber}
          />
        );
      case middleItem.downloadVersionFiles:
        return (
          <DownloadVersionFiles
            activeVersionHash={activeVersionHash}
            activeDocumentHash={activeDocumentHash}
            activeVersionNumber={activeVersionNumber}
          />
        );
      default:
        return (
          <UploadNewVersion
            setActiveDocumentHash={setActiveDocumentHash}
            activeDocumentHash={activeDocumentHash}
            setMiddleRenderItem={setMiddleRenderItem}
          />
        );
    }
  };

  return (
    <Grid
      container
      direction="row"
      spacing={0}
      flex={1}
      sx={{
        flex: 1,
        paddingTop: 20,
        backgroundColor: "#2e3a4d",
        minHeight: "100vh",
      }}
    >
      <Grid item md={0} lg={3}></Grid>
      <Grid
        item
        container
        direction="column"
        alignItems="stretch"
        md={12}
        lg={6}
        sx={{ paddingX: 2 }}
      >
        <UserDetailsBar />
        <Grid item container direction="row">
          <Leftbar
            setMiddleRenderItem={setMiddleRenderItem}
            middleRenderItem={middleRenderItem}
          />
          {renderMiddleItem(middleItem)}
          <Rightbar
            setActiveDocumentHash={setActiveDocumentHash}
            setMiddleRenderItem={setMiddleRenderItem}
          />
        </Grid>
      </Grid>
      <Grid item md={0} lg={3}></Grid>
    </Grid>
  );
};

export default MainScreen;
