/**
 * index.js
 * 
 * Main entry point for the Ethereum address monitoring service. 
 * - Initializes an Express.js server with CORS support.
 * - Provides REST API endpoints to add, remove, and list monitored Ethereum addresses.
 * - Starts block polling across networks for real-time transaction monitoring.
 * 
 * Endpoints:
 * - POST /addAddress: Add an Ethereum address to monitor.
 * - POST /removeAddress: Remove a monitored Ethereum address.
 * - GET /addresses: List all monitored addresses.
 */

const cors = require("cors");

const express = require("express");
const Web3 = require("web3");
const {
  addAddress,
  removeAddress,
  getMonitoredAddresses,
} = require("./addressManager");
const { startPolling } = require("./monitor");
const web3Instances = require("./web3Instances");
const networks = require("./config");

const app = express();
app.use(express.json());
// Enable CORS for specific origin or all origins
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Allowed headers
  })
);

// ======= API Endpoints =======

/**
 * @route   POST /addAddress
 * @desc    Add an Ethereum address to monitor across all networks
 * @body    { address: "0x..." }
 */
app.post("/addAddress", (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is required." });
  }

  if (!Web3.utils.isAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address." });
  }

  const message = addAddress(address);
  return res.status(200).json({ message });
});

/**
 * @route   POST /removeAddress
 * @desc    Remove an Ethereum address from monitoring across all networks
 * @body    { address: "0x..." }
 */
app.post("/removeAddress", (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is required." });
  }

  if (!Web3.utils.isAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address." });
  }

  const message = removeAddress(address);
  return res.status(200).json({ message });
});

/**
 * @route   GET /addresses
 * @desc    Get the list of all monitored Ethereum addresses
 */
app.get("/addresses", (req, res) => {
  const addresses = getMonitoredAddresses();
  return res.status(200).json({ addresses });
});

// ======= Start Polling for Each Network =======

for (const networkKey in web3Instances) {
  startPolling(networkKey, 40000); // Poll every 10 seconds
}

// ======= Start Express Server =======

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nAPI Server is running on port ${PORT}`);
  console.log(`\nAvailable Endpoints:`);
  console.log(
    `POST   /addAddress     - Add an Ethereum address to monitor across all networks`
  );
  console.log(
    `POST   /removeAddress  - Remove an Ethereum address from monitoring across all networks`
  );
  console.log(
    `GET    /addresses      - List all monitored Ethereum addresses\n`
  );
});
