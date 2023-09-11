require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.2",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/Mj6WjEpz_-JChGIkp82--vL_Oq-emxAF",
      accounts: [
        "e6bb4021c9b5906fb9f9b6946a6659723847f45817953f5689442325134ccc6e",
      ],
    },
  },
};
