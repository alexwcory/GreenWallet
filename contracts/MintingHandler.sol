// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface TierOne{
    function mint(address recipient) external returns (uint256 _sbtId);
}
interface TierTwo{
    function mint(address recipient) external returns (uint256 _sbtId);
}
interface TierThree{
    function mint(address recipient) external returns (uint256 _sbtId);
}

contract MintingHandler is Ownable {
    TierOne TOne;
    TierTwo TTwo;
    TierThree TThree;
    
    event setToneAddr(address _address);
    event setTTwoAddr(address _address);
    event setTThreeAddr(address _address);
    event minted(address _address);

    
    function setTOneAddress(address _address) external{
        TOne = TierOne(_address);
        emit setToneAddr(_address);
    }

    function setTTwoAddress(address _address) external{
        TTwo = TierTwo(_address);
        emit setTTwoAddr(_address);
    }

    function setTThreeAddress(address _address) external{
        TThree = TierThree(_address);
        emit setTThreeAddr(_address);
    }

    constructor(){}

    function mint(address _address, string memory _tier) public returns (uint256 _sbtId) {
        if(keccak256(bytes(_tier)) == keccak256(bytes("TierOne"))){
            return TOne.mint(_address);
        } else if(keccak256(bytes(_tier)) == keccak256(bytes("TierTwo"))) {
            return TTwo.mint(_address);
        } else if(keccak256(bytes(_tier)) == keccak256(bytes("TierThree"))) {
            return TThree.mint(_address);
        }
        emit minted(_address);
    }
}