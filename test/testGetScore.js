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
  it("initial score should get set to 9", async () => {
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
      let score = await instance.getScore(walletAddress);
      assert(score = 9, "Score not setting properly");
    } catch (error) {
      console.error("Error in test:", error);
      assert.fail("Test encountered an error");
    }
  });
});


