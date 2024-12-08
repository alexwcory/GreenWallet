//Add, remove, and retrieve addresses

const monitoredAddresses = require("./monitoredAddresses");
const Web3 = require("web3");

function addAddress(address) {
  const lowerCaseAddress = address.toLowerCase();
  if (!monitoredAddresses.has(lowerCaseAddress)) {
    monitoredAddresses.add(lowerCaseAddress);
    console.log(`Added address to monitoring: ${address}`);
    console.log("\nCurrent Monitored Addresses:");
    monitoredAddresses.forEach((addr) => console.log(addr));
    return `Address ${address} added to monitoring list.`;
  } else {
    return `Address ${address} is already being monitored.`;
  }
}

function removeAddress(address) {
  const lowerCaseAddress = address.toLowerCase();
  if (monitoredAddresses.has(lowerCaseAddress)) {
    monitoredAddresses.delete(lowerCaseAddress);
    console.log(`Removed address from monitoring: ${address}`);
    return `Address ${address} removed from monitoring list.`;
  } else {
    return `Address ${address} is not being monitored.`;
  }
}

function getMonitoredAddresses() {
  return Array.from(monitoredAddresses);
}

module.exports = { addAddress, removeAddress, getMonitoredAddresses };
