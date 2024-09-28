const GreenWallet = artifacts.require("GreenWallet");

contract("GreenWallet", (accounts) => {

  async function addWallet(instance, walletAddress, chain, numTransactions) {
        const exists = await instance.addressExists(walletAddress);
        if (!exists) {
          const result = await instance.addIntoContract(walletAddress, chain, numTransactions);
          console.log("Wallet added successfully.");
          assert(result.tx, "Transaction failed");
        } else {
          console.log("This wallet already exists.");
        }
      }
  async function logStoredAddresses(instance) {
        const storedAddresses = await instance.getAddresses();
        for (let i = 0; i < storedAddresses.length; i++) {
          console.log(`Address ${i + 1}: ${storedAddresses[i]}`);
        }
      }
  it("should properly updateTransactions to wallet", async () => {
    try {
      const instance = await GreenWallet.deployed();
      const walletAddress = accounts[1];
      const chain = ["bitcoin", "ethereum"];
      const numTransactions = [2, 4];

      // Get stored addresses and log them
      await instance.addChain("bitcoin");
      await instance.addChain("ethereum");
      await addWallet(instance, walletAddress, chain, numTransactions);
      await logStoredAddresses(instance);
      await instance.updateTransactions(walletAddress, "bitcoin");
      const transactionList = await instance.getNumTransactions.call(walletAddress);
      assert(transactionList[0].toString() == "3", "update failed");
      assert(transactionList[1].toString() == "4", "update failed");
    } catch (error) {
      console.error("Error in test:", error);
      assert.fail("Test encountered an error");
    }
  });
});


