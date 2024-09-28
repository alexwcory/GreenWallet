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
    mapping(address => mapping(string => uint256)) private mintedRegistryForWallets;

    constructor(){}

    event setITierAddressInMintingRegistry(address _address);

    function setITierAddress(address _address) external{
        ITier = ITierRegistry(_address);
        emit setITierAddressInMintingRegistry(_address);
    }
    function addAddress(address _address) public  {
        addresses.push(_address);
        for (uint i = 0; i < ITier.getTiers().length; i++) {
            mintedRegistryForWallets[_address][ITier.getTiers()[i]] = 0;
        }
    }
    
    function getAddresses() public pure returns (address[] memory _addresses){
        return _addresses;
    }

    function updateMintedRegistryForWallets(address _address, string memory _tier, uint256 _sbtId) public {
        mintedRegistryForWallets[_address][_tier] = _sbtId;
    }
    
    function deleteMintedRegistryForWallets(address _address, string memory _tier) public {
        delete mintedRegistryForWallets[_address][_tier];
    }

    function hasMintedSBT(address _address, string memory _tier) public view returns (bool _hasMinted){
        return mintedRegistryForWallets[_address][_tier] != 0;
    }
    function setMintedSBT(address _address, string memory _tier, uint256 _sbtId) public {
        mintedRegistryForWallets[_address][_tier] = _sbtId;
    }
    function getAllMintedSBTs(address _address) public view returns (string[] memory _tiersOwned){
        string[] memory tiers = ITier.getTiers();
        uint256 count = 0;
        for (uint256 i = 0; i < tiers.length; i++) {
            if (mintedRegistryForWallets[_address][tiers[i]] != 0) {
                count++;
            }
        }
        string[] memory tiersOwned = new string[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < tiers.length; i++) {
            if (mintedRegistryForWallets[_address][tiers[i]] != 0) {
                tiersOwned[index] = tiers[i];
                index++;
            }
        }
        return tiersOwned;
    }
}