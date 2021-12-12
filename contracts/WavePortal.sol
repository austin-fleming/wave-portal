// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    address[] senderHistory;


    constructor() {
        console.log("My first contract!");
    }

    function wave() public {
        totalWaves += 1;
        senderHistory.push(msg.sender);
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getSenderHistory() public view returns (address[] memory) {
        return senderHistory;
    }
}