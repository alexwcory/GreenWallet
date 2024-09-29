// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface MRegister{
    function hasMintedSBT(address _address, string memory _tier) external view returns (bool _hasMinted);
    function setMintedSBT(address _address, string memory _tier) external;
}
interface MHandler{
    function mint(address _address, string memory _tier) external returns (uint256);
}
contract MintingManager is Ownable {
    MRegister MReg;
    MHandler MHand;
    mapping(address => int) score;

    event setMRegAddrInMManager(address _address);
    event setMHandAddrInMManager(address _address);
    constructor() {}

    function setMRegAddress(address _address) external{
        MReg = MRegister(_address);
        emit setMRegAddrInMManager(_address);
    }

    function setMHandAddress(address _address) external{
        MHand = MHandler(_address);
        emit setMHandAddrInMManager(_address);
    }

    function calculateScore(address walletAddress, string[] memory chains, 
            int[] memory numTransactions) public returns (int _score){
        int scoreValue = 9;
        score[walletAddress] = scoreValue;
        return scoreValue;
    }

    function getScore(address _walletAddress) public view returns(int){
        return score[_walletAddress];
    }

    function mintSBTLogic(address _walletAddress, int _score) public {
        if(_score >=15 && !MReg.hasMintedSBT(_walletAddress, "TierThree")){
            uint256 newSbtId = MHand.mint(_walletAddress, "TierThree");
            MReg.setMintedSBT(_walletAddress, "TierThree");
        } else if(_score >=10 && !MReg.hasMintedSBT(_walletAddress, "TierTwo")){
            uint256 newSbtId = MHand.mint(_walletAddress, "TierTwo");
            MReg.setMintedSBT(_walletAddress, "TierTwo");
        } else if(_score >=5 && !MReg.hasMintedSBT(_walletAddress, "TierOne")){
            uint256 newSbtId = MHand.mint(_walletAddress, "TierOne");
            MReg.setMintedSBT(_walletAddress, "TierOne");
        }
    }

    // function updateAllScores() {

    // }
}
