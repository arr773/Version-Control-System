const hre = require("hardhat");

async function main() {
  const MajorProjectFactory = await hre.ethers.getContractFactory(
    "MajorProject"
  );
  const majorProjectContract = await MajorProjectFactory.deploy();

  await majorProjectContract.deployed();

  console.log(
    "Major Project contract deployed to: ",
    majorProjectContract.address
  );
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
