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
    mapping(address => int[]) private mintedRegistryForWallets;
    mapping(address => int) private numMinted;

    constructor(){}

    event setITierAddressInMintingRegistry(address _address);

    function setITierAddress(address _address) external{
        ITier = ITierRegistry(_address);
        emit setITierAddressInMintingRegistry(_address);
    }
    
    function getAddresses() public pure returns (address[] memory _addresses){
        return _addresses;
    }

    function addTier(address _address, int _tier) public {
        int[] memory userStrings = mintedRegistryForWallets[_address];
        bool hasValue = false;
        for (uint256 i = 0; i < userStrings.length; i++) {
            if (keccak256(abi.encodePacked(userStrings[i])) == keccak256(abi.encodePacked(_tier))) {
                hasValue = true;
            }
        }
        if (hasValue == false) {
            mintedRegistryForWallets[_address].push(_tier);
            numMinted[_address]++;
        }
    }
    
    function deleteMintedRegistryForWallets(address _address, string memory _tier) public {
        delete mintedRegistryForWallets[_address];
    }

    function hasMintedSBT(address _address, int _tier) public view returns (bool _hasMinted){
        uint256 length = uint256(numMinted[_address]);
        bool has = false;
        for(uint256 i = 0; i < length; i++){
            if(mintedRegistryForWallets[_address][i] == _tier){
                has = true;
            }
        }
        return has;
    }

    function getAllMintedSBTs(address _address) public view returns (int _tiersOwned) {
        // return mintedRegistryForWallets[_address];
        return numMinted[_address];
    }
    function setMintedSBT(address _address, int _tier) public {
        mintedRegistryForWallets[_address].push(_tier);
        numMinted[_address]++;
    }
}