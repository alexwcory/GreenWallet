// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface MManager{
    function calculateScore(address walletAddress, string[] memory chains, int[] memory numTransactions) external returns(int);
    function mintSBTLogic(address _walletAddress, int _score) external;
    function getScore(address _walletAddress) external returns(int);
}

interface MRegister{
    function getAllMintedSBTs(address _address) external returns (string[] memory _tiersOwned);
}
contract GreenWallet {
    mapping(address => mapping(string => int)) private transactions;
    address[] addresses;
    string[] chains;
    MManager MMan;
    MRegister MReg;
    event setMManRegInGreenWallet(address _address);
    event setMRegInGreenWallet(address _address);

    constructor(){}

    function setMManAddress(address _address) external{
        MMan = MManager(_address);
        emit setMManRegInGreenWallet(_address);
    }

    function setMRegAddress(address _address) external {
        MReg = MRegister(_address);
        emit setMManRegInGreenWallet(_address);
    }

    function getAddresses() public view returns (address[] memory _addresses) {
        return addresses;
    }

    function addIntoContract(address _walletAddress, string[] memory _chains, int[] memory numTransactions) 
            public {
        require(!addressExists(_walletAddress), "This wallet already exists in this contract");
        require(_chains.length == numTransactions.length, "Categories and values arrays must be of equal length");
        addresses.push(_walletAddress);
        for (uint256 i = 0; i < _chains.length; i++) {
            transactions[_walletAddress][_chains[i]] = numTransactions[i];
        }
        int score = MMan.calculateScore(_walletAddress, chains, numTransactions);
        MMan.mintSBTLogic(_walletAddress, score);
    }

    function updateTransactions(address _walletAddress, string memory _chain) public {
        transactions[_walletAddress][_chain] += 1;
        int score = MMan.calculateScore(_walletAddress, chains, getNumTransactions(_walletAddress));
        MMan.mintSBTLogic(_walletAddress, score);
    }

    function getScore(address _walletAddress) public returns (int walletScore) {
        require(addressExists(_walletAddress), "This wallet does not exist in this contract");
        return MMan.getScore(_walletAddress);
    }
    
    function getNumTransactions(address _walletAddress) public view returns (int[] memory _transactionList){
        int[] memory _transactions = new int[](chains.length);
        for(uint256 i = 0; i < chains.length; i++) {
            _transactions[i] = transactions[_walletAddress][chains[i]];
        }
        return _transactions;
    }

    function addressExists(address _walletAddress) public view returns (bool) {
        for (uint i = 0; i < addresses.length; i++) {
            if (addresses[i] == _walletAddress) {
                return true;
            }
        }
        return false;
    }
    function walletOwns(address _walletAddress) public returns (string[] memory ownedTiers) {
        return MReg.getAllMintedSBTs(_walletAddress);
    }
    function addChain(string memory chain) public {
        chains.push(chain);
        for(uint i = 0; i < addresses.length; i++){
            transactions[addresses[i]][chain] = 0;
        }
    }
    function getChains() public view returns (string[] memory chainsList) {
        return chains;
    }
}
