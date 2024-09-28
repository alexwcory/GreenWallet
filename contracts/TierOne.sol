// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract TierOne is ERC721URIStorage {
    uint256 _currentTokenId;
    string private _baseTokenURI;

    event mintedTOne(address _address);

    constructor(string memory baseTokenURI) ERC721("TierOne", "T1") {
        _baseTokenURI = baseTokenURI;
        _currentTokenId = 1;
    }
    
    function setBaseTokenURI(string memory baseTokenURI) public {
        _baseTokenURI = baseTokenURI;
    }

    function mint(address _recipient) public returns (uint256 _sbtId){
        _currentTokenId += 1;
        uint256 newItemId = _currentTokenId;
        _mint(_recipient, newItemId);
        emit mintedTOne(_recipient);
        return _currentTokenId;
    }

    function checkOwnership(address wallet) public view returns (bool) {
        for (uint256 tokenId = 1; tokenId <= _currentTokenId; tokenId++) {
            if (ownerOf(tokenId) == wallet) {
                return true;
            }
        }
        return false;
    }

    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");
        _burn(tokenId);
    }

    function approve(address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        require(to == address(0), "token is SOUL BOUND");
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override(ERC721, IERC721) {
        require(!approved, "token is SOUL BOUND");
        super.setApprovalForAll(operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        require(false, "token is SOUL BOUND");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override(ERC721, IERC721) {
        require(false, "token is SOUL BOUND");
    }
}