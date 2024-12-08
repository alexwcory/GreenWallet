//Network Configurations

require("dotenv").config({ path: "../.env" });
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID; // Replace with your actual Infura Project ID

const networks = {
  ethereum: {
    name: "ethereum",
    http: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
  },
  // arbitrum: {
  //   name: 'arbitrum',
  //   // Replace with the correct Sepolia endpoint for Arbitrum if available
  //   http: `https://arbitrum-sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
  // },
  // optimism: {
  //   name: 'optimism',
  //   // Replace with the correct Sepolia endpoint for Optimism if available
  //   http: `https://optimism-sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
  // },
};

module.exports = networks;
