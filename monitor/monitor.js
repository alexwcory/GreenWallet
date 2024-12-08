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

  try {
    // Ensure block numbers are handled as BigInt
    const currentBlockNumber = BigInt(await web3.eth.getBlockNumber());
    const lastProcessed = BigInt(latestBlocks[networkKey] || 0n); // Default to 0 if undefined

    if (currentBlockNumber > lastProcessed) {
      console.log(
        `[${networks[networkKey].name}] New blocks detected: ${
          lastProcessed + 1n
        } to ${currentBlockNumber}`
      );

      console.log(`[DEBUG] Starting block range: ${lastProcessed + 1n}`);
      console.log(`[DEBUG] Ending block range: ${currentBlockNumber}`);

      for (
        let blockNumber = lastProcessed + 1n;
        blockNumber <= currentBlockNumber;
        blockNumber++
      ) {
        console.log("Block Number: ", blockNumber);
        const block = await web3.eth.getBlock(Number(blockNumber), true); // Convert BigInt to Number for API call

        if (block && block.transactions) {
          block.transactions.forEach((tx) => {
            const from = tx.from ? tx.from.toLowerCase() : null;
            const to = tx.to ? tx.to.toLowerCase() : null;

            if (from && monitoredAddresses.has(from)) {
              console.log(
                `\n[${networkKey}] Address: ${from} - Transaction detected on ${networks[networkKey].name}`
              );
            }

            if (to && monitoredAddresses.has(to)) {
              console.log(
                `\n[${networkKey}] Address: ${to} - Transaction detected on ${networks[networkKey].name}`
              );
            }
          });
        }

        // Update the latest processed block
        latestBlocks[networkKey] = blockNumber; // Store as BigInt
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
