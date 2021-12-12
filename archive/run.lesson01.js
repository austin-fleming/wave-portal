/* 
    HRE is the "Hardhat Runtime Environment".
    It is not necessary to explicitly import 'hre'.
    Instead, it is built on the fly using 'hardhat.config.js' when the file is run via 'npx hardhat'
    https://hardhat.org/advanced/hardhat-runtime-environment.html
*/

async function main() {
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal'); // compiles contract and adds files to /artifacts
    const waveContract = await waveContractFactory.deploy(); // hardhat spins up local blockchain instance then runs contract
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address); // gives address of deployed contract. Important when deploying to actual chain.
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runMain();
// run with npx hardhat run scripts/run.js