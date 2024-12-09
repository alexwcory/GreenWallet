/**
 * monitor.js
 *
 * Handles block polling for Ethereum networks:
 * - `pollNewBlocks`: Fetches new blocks and logs transactions involving monitored addresses.
 * - `startPolling`: Initiates regular polling for new blocks on a given network.
 *
 * Usage:
 * - Call `startPolling(networkKey, interval)` to begin monitoring.
 */


require('dotenv').config({ path: '../.env' });
const Web3 = require("web3"); 

const greenWalletJSON = require("../build/contracts/GreenWallet.json"); 
const contractAddress = process.env.GREEN_WALLET_ADDRESS; 
const deployerAddress = process.env.OWNER_ADDRESS;

const web3Instances = require("./web3Instances");
const monitoredAddresses = require("./monitoredAddresses");
const latestBlocks = require("./latestBlocks");
const networks = require("./config");

/**
 * Polls for new blocks on a specific network and logs transactions involving monitored addresses.
 * @param {string} networkKey - The key of the network (e.g., 'ethereum', 'arbitrum', 'optimism').
 */
async function pollNewBlocks(networkKey) {
  const web3 = web3Instances[networkKey];
  if (!web3) {
    console.error(`Web3 instance for ${networkKey} not found.`);
    return;
  }
  const greenWalletContract = new web3.eth.Contract(
    greenWalletJSON.abi,
    contractAddress
  );

  try {
    const currentBlockNumber = BigInt(await web3.eth.getBlockNumber());
    const lastProcessed = BigInt(latestBlocks[networkKey] || 0n);

    if (currentBlockNumber > lastProcessed) {
      console.log(
        `[${networks[networkKey].name}] New blocks detected: ${
          lastProcessed + 1n
        } to ${currentBlockNumber}`
      );

      for (
        let blockNumber = lastProcessed + 1n;
        blockNumber <= currentBlockNumber;
        blockNumber++
      ) {
        const block = await web3.eth.getBlock(Number(blockNumber), true); // Convert BigInt to Number for API call

        if (block && block.transactions) {
          for (const tx of block.transactions) {
            const from = tx.from ? tx.from.toLowerCase() : null;
            const to = tx.to ? tx.to.toLowerCase() : null;

            if (from && monitoredAddresses.has(from)) {
              console.log(
                `Transaction detected from: ${from} on ${networks[networkKey].name}`
              );

              try {
                const walletAddress = from; // Wallet address sending the transaction
                const chain = networks[networkKey].name; // Chain name (e.g., 'ethereum')

                await greenWalletContract.methods
                  .updateTransactions(walletAddress, chain)
                  .send({ from: deployerAddress });
                console.log(`Transaction data updated for address: ${from}`);
              } catch (err) {
                console.error(
                  "Error calling updateTransactions:",
                  err
                );
              }
            }

            if (to && monitoredAddresses.has(to)) {
              console.log(
                `Transaction detected to: ${to} on ${networks[networkKey].name}`
              );

              try {
                const walletAddress = to; // Wallet address receiving the transaction
                const chain = networks[networkKey].name; // Chain name (e.g., 'ethereum')

                await greenWalletContract.methods
                  .updateTransactions(walletAddress, chain)
                  .send({ from: deployerAddress });
                console.log(`Transaction data updated for address: ${to}`);
              } catch (err) {
                console.error("Error calling updateTransactions for to:", err);
              }
            }
          }
        }

        latestBlocks[networkKey] = blockNumber; // Update last processed block
      }
    }
  } catch (error) {
    console.error(`Error polling blocks for ${networkKey}:`, error);
  }
}

/**
 *
 * Starts polling for new blocks on a specific network at regular intervals.
 * @param {string} networkKey - The key of the network (e.g., 'ethereum', 'arbitrum', 'optimism').
 * @param {number} interval - Polling interval in milliseconds.
 */
function startPolling(networkKey, interval = 10000) {
  // Default: 10 seconds
  // Initialize latestBlocks if not set
  (async () => {
    try {
      const currentBlock = await web3Instances[networkKey].eth.getBlockNumber();
      latestBlocks[networkKey] = currentBlock;
      console.log(
        `[${networkKey}] Starting from block number: ${currentBlock}`
      );
    } catch (error) {
      console.error(
        `Error fetching initial block number for ${networkKey}:`,
        error
      );
    }
  })();

  // Start polling at regular intervals
  setInterval(() => {
    pollNewBlocks(networkKey);
  }, interval);
}

module.exports = { startPolling };
