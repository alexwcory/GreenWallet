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
  it("initial wallet should own TierOne", async () => {
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
      let tiersOwned = await instance.walletOwns(walletAddress);
      console.log(`Num tiers owned: ${tiersOwned.length}`);
      for(let i = 0; i < tiersOwned.length; i++){
        console.log(tiersOwned[i]);
      }
    //   assert(tiersOwned.length == 1);
      console.log("Is length of 1");
      assert(tiersOwned[0] == "TierOne", "Incorrect base wallet owns");
    } catch (error) {
      console.error("Error in test:", error);
      assert.fail("Test encountered an error");
    }
  });
});


