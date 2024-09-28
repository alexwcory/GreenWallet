const GreenWallet = artifacts.require("GreenWallet");

module.exports = async function(callback) {
  try {
    const instance = await GreenWallet.deployed();
    const accounts = await web3.eth.getAccounts();
    const walletAddress = accounts[1];
    const chain = ["bitcoin", "ethereum"];
    const numTransactions = [2, 4];
    const storedAddresses = await instance.getAddresses();
    for (let i = 0; i < storedAddresses.length; i++) {
        console.log(`Address ${i + 1}: ${storedAddresses[i]}`);
      }

    const exists = await instance.addressExists(walletAddress);
    if (!exists) {
      await instance.addIntoContract(walletAddress, chain, numTransactions);
      console.log("Wallet added successfully.");
    } else {
      console.log("This wallet already exists.");
    }
  } catch (error) {
    console.error(error);
  }

  callback();
};
