import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../lib/constants";

export const MainContext = createContext();

let provider;

export const getEthereumContract = (async () => {
  if (!window.ethereum) return alert("Install metamask");
  provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  console.log(transactionContract);
  return transactionContract;
})();

export const MainProvider = ({ children }) => {
  const [appStatus, setAppStatus] = useState("loading");
  const [loading, setLoading] = useState("true");
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    setLoading(true);
    if (!window.ethereum) return alert("Install metamask");
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        setAppStatus("connected");
        setCurrentAccount(addressArray[0]);
      } else {
        setAppStatus("notConnected");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const connectToWallet = async () => {
    if (!window.ethereum) {
      setAppStatus("noMetaMask");
      return alert("Install metamask");
    }
    try {
      setAppStatus("loading");
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0]);
        setAppStatus("connected");
      } else {
        setAppStatus("notConnected");
      }
    } catch (err) {
      setAppStatus("error");
      console.log(err);
    }
  };

  const addActiveUser = async (userWalletAddress = currentAccount) => {
    if (!window.ethereum)
      if (!window.ethereum) {
        setAppStatus("noMetaMask");
        return alert("Install metamask");
      }
    const MajorProjectContract = await getEthereumContract;
    await MajorProjectContract.addActiveUser(currentAccount);
  };

  const getUserStatus = async (userWalletAddress = currentAccount) => {
    if (!window.ethereum)
      if (!window.ethereum) {
        setAppStatus("noMetaMask");
        return alert("Install metamask");
      }
    const MajorProjectContract = await getEthereumContract;
    await MajorProjectContract.getUserStatus();
    const status = await MajorProjectContract.getUserStatus();
    setCurrentStatus(status);
  };

  const getContracts = async (userWalletAddress = currentAccount) => {
    if (!window.ethereum)
      if (!window.ethereum) {
        setAppStatus("noMetaMask");
        return alert("Install metamask");
      }
    const MajorProjectContract = await getEthereumContract;
    const addresses = await MajorProjectContract.getDocumentContracts();
    return addresses;
  };

  return (
    <MainContext.Provider
      value={{
        appStatus,
        currentAccount,
        connectToWallet,
        addActiveUser,
        getUserStatus,
        currentStatus,
        getContracts,
        loading,
        setLoading,
        userDetailsLoading,
        setUserDetailsLoading,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
