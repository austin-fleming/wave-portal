# Buildspace / Wave Portal

## This Project

- Spin up a Node: npx ```hardhat node```
- In order for imports to function properly in Solidity, especially in monorepos, the Solidity extension must be pointed to node_modules.
        - Go to workplace settings
        - Set ```"solidity.packageDefaultDependenciesDirectory"``` to the relevant node_modules directory.

## Updating Contracts

Contracts are immutable, thus redeploying a contract means creating an entirely new one. This also means data stored in the previous contract will not be present in the new contract.

When redeploying, be mindful to:

- update contract address on frontend
- update ABI file on frontend

## Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
