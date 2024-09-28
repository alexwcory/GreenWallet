const GreenWallet = artifacts.require("GreenWallet");

contract("GreenWallet", (accounts) => {

  async function logStoredAddresses(instance) {
        const storedAddresses = await instance.getAddresses();
        for (let i = 0; i < storedAddresses.length; i++) {
          console.log(`Address ${i + 1}: ${storedAddresses[i]}`);
        }
      }
  it("should add a wallet if it does not already exist and log addresses", async () => {
    try {
      const instance = await GreenWallet.deployed();
      const walletAddress = accounts[1];
      const chain = ["bitcoin", "ethereum"];
      const numTransactions = [2, 4];

      // Get stored addresses and log them
      await logStoredAddresses(instance);

      // Check if the wallet address already exists
      const exists = await instance.addressExists(walletAddress);
      if (!exists) {
        const result = await instance.addIntoContract(walletAddress, chain, numTransactions);
        console.log("Wallet added successfully.");
        assert(result.tx, "Transaction failed"); // Assert that the transaction was successful
      } else {
        console.log("This wallet already exists.");
      }
      await logStoredAddresses(instance);
    } catch (error) {
      console.error("Error in test:", error);
      assert.fail("Test encountered an error");
    }
  });
});


