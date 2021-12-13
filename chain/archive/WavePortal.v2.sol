// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    // events log information publically. For example, this will be logged in the transaction history on etherscan.io
    // https://hackernoon.com/how-to-use-events-in-solidity-pe1735t5
    // provides an easy way to trigger the frontend by watching for the event.
    // Allows significantly cheaper data storage than storing in a contract variable;
    // however, logs cannot be accessed by a contract.
    // Index by the term you will most often use to lookup the log from. You can index by up to (3) parameters.
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address sender;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() {
        console.log("Let's make this smart contract.");
    }

    // injests a message from the frontend
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved and sent the message: %s", msg.sender, _message);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("To date, %d waves have been sent!", totalWaves);
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
}