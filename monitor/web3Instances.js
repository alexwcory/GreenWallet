//Initializes Web3 instances for each network

const { Web3 } = require("web3"); 
const networks = require("./config"); 

const web3Instances = {};

for (const key in networks) {
  const network = networks[key];
  try {
    // Initialize Web3 instance with the HTTP provider
    web3Instances[key] = new Web3(network.http);
    console.log(`✅ Initialized Web3 for ${network.name}`);
  } catch (error) {
    console.error(
      `❌ Failed to initialize Web3 for ${network.name}:`,
      error.message
    );
  }
}

module.exports = web3Instances;
