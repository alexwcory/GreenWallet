// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/StringArrayUtils.sol";

interface ITierRegistry {
    function getTiers() external view returns (string[] memory);
}

contract MintingRegistry{

    ITierRegistry ITier;
    using StringArrayUtils for string[];
    address[] addresses;
    mapping(address => string[]) private mintedRegistryForWallets;

    constructor(){}

    event setITierAddressInMintingRegistry(address _address);

    function setITierAddress(address _address) external{
        ITier = ITierRegistry(_address);
        emit setITierAddressInMintingRegistry(_address);
    }
    
    function getAddresses() public pure returns (address[] memory _addresses){
        return _addresses;
    }

    function addTier(address _address, string memory _tier) public {
        string[] storage userStrings = mintedRegistryForWallets[_address];
        bool hasValue = false;
        for (uint256 i = 0; i < userStrings.length; i++) {
            if (keccak256(abi.encodePacked(userStrings[i])) == keccak256(abi.encodePacked(_tier))) {
                hasValue = true;
            }
        }
        if (hasValue == false) {
            mintedRegistryForWallets[_address].push(_tier);
        }
    }
    
    function deleteMintedRegistryForWallets(address _address, string memory _tier) public {
        delete mintedRegistryForWallets[_address];
    }

    function hasMintedSBT(address _address, string memory _tier) public view returns (bool _hasMinted){
        string[] storage userStrings = mintedRegistryForWallets[_address];
        bool hasValue = false;
        for (uint256 i = 0; i < userStrings.length; i++) {
            if (keccak256(abi.encodePacked(userStrings[i])) == keccak256(abi.encodePacked(_tier))) {
                hasValue = true;
            }
        }
        return hasValue;
    }

    function getAllMintedSBTs(address _address) public view returns (string[] memory _tiersOwned){
        // return mintedRegistryForWallets[_address];
        string[] storage storedArray = mintedRegistryForWallets[_address];
        string[] memory tiersOwned = new string[](storedArray.length);

        for (uint256 i = 0; i < storedArray.length; i++) {
            tiersOwned[i] = storedArray[i];
        }

    return tiersOwned;
    }
    function setMintedSBT(address _address, string memory tier) external {
        if(!hasMintedSBT(_address, tier)){
            mintedRegistryForWallets[_address].push(tier);
        }
        
    }
    
}