const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log('Deploying contracts with account: ', deployer.address);
    

    const Token = await hre.ethers.getContractFactory('WavePortal');
    const portal = await Token.deploy({
        value: hre.ethers.utils.parseEther('0.001')
    }); // Deploy with an initial balance

    console.log('Account Balance: ', accountBalance.toString());
    
    await portal.deployed();

    console.log('WavePortal address: ', portal.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

runMain();
// For local test:
// deploy with: npx hardhat run scripts/deploy.js --network localhost
// Make sure it's a different tab than the running node

// For Rinkeby live test:
// deploy with: npx hardhat run scripts/deploy.js --network rinkeby
