// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/StringArrayUtils.sol";

interface IMintingRegistry {
    function getAddresses() external view returns (address[] memory);
    function deleteMintedRegistryForWallets(address _addr, string memory tier) external;
}

contract TierRegistry is Ownable {
    IMintingRegistry IMint;
    using StringArrayUtils for string[];
    string[] public tiers;
    mapping(string => int) scoreRequirements;
    mapping(string => address) tierSBTAddresses;

    constructor(address initialOwner) Ownable(){}
    
    function setIMintAddress(address _address) external{
        IMint = IMintingRegistry(_address);
    }

    function addTier(string memory _tier, int _tierScoreRequirement, address _tierAddress) public onlyOwner() {
        require(!tiers.contains(_tier), "Tier already exists");
        tiers.push(_tier);
        scoreRequirements[_tier] = _tierScoreRequirement;
        tierSBTAddresses[_tier] = _tierAddress;
    }
    
    function removeTier(string memory _tier) public onlyOwner() {
        require(tiers.contains(_tier), "Tier doesn't exist, cannot be removed");
        tiers.remove(_tier);
        for (uint i = 0; i < IMint.getAddresses().length; i++) { 
            // if(mintedRegistryForWallets[addresses[i]][_tier] == true){
            //     burn the SBT 
            // }
            IMint.deleteMintedRegistryForWallets(IMint.getAddresses()[i], _tier);
        }
    }
    function getTiers() public view returns (string[] memory _tiers) {
        return tiers;
    }
}