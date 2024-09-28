// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library StringArrayUtils {
    function contains(string[] storage array, string memory str) internal view returns (bool) {
        for (uint i = 0; i < array.length; i++) {
            if (keccak256(abi.encodePacked(array[i])) == keccak256(abi.encodePacked(str))) {
                return true;
            }
        }
        return false;
    }
    function remove(string[] storage array, string memory str) internal returns (bool) {
        uint index = findIndex(array, str);
        if (index == array.length) {
            return false; // String not found
        }
        
        for (uint i = index; i < array.length - 1; i++) {
            array[i] = array[i + 1];
        }
        array.pop();
        return true;
    }
    function findIndex(string[] storage array, string memory str) internal view returns (uint) {
        for (uint i = 0; i < array.length; i++) {
            if (keccak256(abi.encodePacked(array[i])) == keccak256(abi.encodePacked(str))) {
                return i;
            }
        }
        return array.length; // Return an invalid index if not found
    }
}