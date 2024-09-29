const GreenWallet = artifacts.require("GreenWallet");
const MintingHandler = artifacts.require("MintingHandler");
const MintingManager = artifacts.require("MintingManager");
const MintingRegistry = artifacts.require("MintingRegistry");
const TierRegistry = artifacts.require("TierRegistry");
const TierOne = artifacts.require("TierOne");
const TierTwo = artifacts.require("TierTwo");
const TierThree = artifacts.require("TierThree");

module.exports = async function(deployer, network, accounts) {
  console.log("Migration script started");
  console.log("Network:", network);
  console.log("Accounts:", accounts);

  const ownerAddress = accounts[0];
  console.log("Deploying GreenWallet with owner address:", ownerAddress);

  let greenWallet;
  try {
    // Deploy GreenWallet
    await deployer.deploy(GreenWallet);
    greenWallet = await GreenWallet.deployed();
    console.log("GreenWallet deployed at:", greenWallet.address);
  } catch (error) {
    console.error("Failed to deploy GreenWallet:", error);
    return;
  }

  let mintingManager;
  try {
    // Deploy MintingManager with necessary arguments
    await deployer.deploy(MintingManager);
    mintingManager = await MintingManager.deployed();
    console.log("MintingManager deployed at:", mintingManager.address);
    const receipt = await greenWallet.setMManAddress(mintingManager.address);
    for (let i = 0; i < receipt.logs.length; i++) {
      const log = receipt.logs[i];
      console.log(`Event ${log.event}:`, log.args);
    }
  } catch (error) {
    console.error("Failed to deploy MintingManager:", error);
    return;
  }

  let mintingRegistry;
  try {
    // Deploy MintingRegistry
    await deployer.deploy(MintingRegistry);
    mintingRegistry = await MintingRegistry.deployed();
    const mmReceipt = await mintingManager.setMRegAddress(mintingRegistry.address);
    for (let i = 0; i < mmReceipt.logs.length; i++) {
      const mmLog = mmReceipt.logs[i];
      console.log(`Event ${mmLog.event}:`, mmLog.args);
    }
    const gwReceipt = await greenWallet.setMRegAddress(mintingRegistry.address); 
    for (let i = 0; i < gwReceipt.logs.length; i++) {
      const gwLog = gwReceipt.logs[i];
      console.log(`Event ${gwLog.event}:`, gwLog.args);
    }
    console.log("MintingRegistry deployed at:", mintingRegistry.address);
  } catch (error) {
    console.error("Failed to deploy MintingRegistry:", error);
    return;
  }

  let tierRegistry;
  try {
    // Deploy TierRegistry with initial owner address
    console.log("Deploying TierRegistry with initial owner address...");
    await deployer.deploy(TierRegistry, ownerAddress);
    tierRegistry = await TierRegistry.deployed();
    console.log("TierRegistry deployed at:", tierRegistry.address);

    // Set the IMint address in TierRegistry
    await tierRegistry.setIMintAddress(mintingRegistry.address);
    console.log("IMint address set in TierRegistry:", mintingRegistry.address);
    await mintingRegistry.setITierAddress(tierRegistry.address);
    console.log("ITier address set in MintingRegistry:", tierRegistry.address);
  } catch (error) {
    console.error("Failed to deploy TierRegistry or set IMint address:", error);
    return;
  }

  let mintingHandler;
  try {
    // Deploy MintingHandler with necessary arguments
    await deployer.deploy(MintingHandler);
    mintingHandler = await MintingHandler.deployed();
    const receipt = await mintingManager.setMHandAddress(mintingHandler.address);
    for (let i = 0; i < receipt.logs.length; i++) {
      const log = receipt.logs[i];
      console.log(`Event ${log.event}:`, log.args);
    }
    console.log("MintingHandler deployed at:", mintingHandler.address);
  } catch (error) {
    console.error("Failed to deploy MintingHandler:", error);
    return;
  }

  let tierOne, tierTwo, tierThree;
  try {
    // Deploy TierOne
    await deployer.deploy(TierOne, "http://localhost:3000/sbts/sbt_metadata/tier_one_metadata.json");
    tierOne = await TierOne.deployed();
    const receiptOne = await mintingHandler.setTOneAddress(tierOne.address);
    for (let i = 0; i < receiptOne.logs.length; i++) {
      const log = receiptOne.logs[i];
      console.log(`Event ${log.event}:`, log.args);
    }
    const toneAddr = await greenWallet.setTOneAddress(tierOne.address); 
    console.log("Set greenwallet tone addr at:", tierOne.address);
    console.log("TierOne deployed at:", tierOne.address);

    // Deploy TierTwo
    await deployer.deploy(TierTwo, "http://localhost:3000/sbts/sbt_metadata/tier_two_metadata.json");
    tierTwo = await TierTwo.deployed();
    const receiptTwo = await mintingHandler.setTTwoAddress(tierTwo.address);
    for (let i = 0; i < receiptTwo.logs.length; i++) {
      const log = receiptTwo.logs[i];
      console.log(`Event ${log.event}:`, log.args);
    }
    // tierTwo.setBaseTokenURI('http://localhost:3000/sbts/sbt_metadata/tier_two_metadata.json');
    console.log("TierTwo deployed at:", tierTwo.address);

    // Deploy TierThree
    await deployer.deploy(TierThree, "http://localhost:3000/sbts/sbt_metadata/tier_one_metadata.json");
    tierThree = await TierThree.deployed();
    const receiptThree = await mintingHandler.setTThreeAddress(tierThree.address);
    for (let i = 0; i < receiptThree.logs.length; i++) {
      const log = receiptThree.logs[i];
      console.log(`Event ${log.event}:`, log.args);
    }
    console.log("TierThree deployed at:", tierThree.address);
  } catch (error) {
    console.error("Failed to deploy Tier contracts:", error);
    return;
  }

  try {
    // Register the tiers in TierRegistry
    await tierRegistry.addTier("TierOne", 5, tierOne.address);
    console.log("TierOne registered in TierRegistry");
    await tierRegistry.addTier("TierTwo", 5, tierTwo.address);
    console.log("TierTwo registered in TierRegistry");
    await tierRegistry.addTier("TierThree", 5, tierThree.address);
    console.log("TierThree registered in TierRegistry");
  } catch (error) {
    console.error("Failed to register tiers in TierRegistry:", error);
    return;
  }

  console.log("Migration script completed successfully");
};
