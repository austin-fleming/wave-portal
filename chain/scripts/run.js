/* 
    HRE is the "Hardhat Runtime Environment".
    It is not necessary to explicitly import 'hre'.
    Instead, it is built on the fly using 'hardhat.config.js' when the file is run via 'npx hardhat'
    https://hardhat.org/advanced/hardhat-runtime-environment.html
*/

async function main() {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal'); // compiles contract and adds files to /artifacts
    const waveContract = await waveContractFactory.deploy(); // hardhat spins up local blockchain instance then runs contract
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address); // gives address of deployed contract. Important when deploying to actual chain.
    console.log("Contract deployed by:", owner.address);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave();
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves(); // Log shows that this is the 'owner' waving.

    waveTxn = await waveContract.connect(randomPerson).wave(); // Simulates an external person calling wave.
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
    
    senderHistory = await waveContract.getSenderHistory();
    console.log('Sender History:\n', senderHistory);
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