/* 
    HRE is the "Hardhat Runtime Environment".
    It is not necessary to explicitly import 'hre'.
    Instead, it is built on the fly using 'hardhat.config.js' when the file is run via 'npx hardhat'
    https://hardhat.org/advanced/hardhat-runtime-environment.html
*/

async function main() {
    console.log('\n########################\n     Start Run Test     \n########################');

    console.group("\nStart Deployment:");
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal'); // compiles contract and adds files to /artifacts
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1')
    }); // hardhat spins up local blockchain instance then runs contract with an initial balance
    await waveContract.deployed();

    console.log("Contract deployment address:", waveContract.address); // gives address of deployed contract. Important when deploying to actual chain.
    console.log("Contract deployed by:", owner.address);
    console.groupEnd()

    console.group("\nInitial contract balance:")
    const initialBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Unformatted balance:', initialBalance);
    console.log('Formatted balance:', hre.ethers.utils.formatEther(initialBalance));
    console.groupEnd()

    console.group('\nInvoke "getTotalWaves":')
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log("Current wave count:", waveCount.toNumber())
    console.groupEnd()

    console.group('\nInvoke "wave":');
    const testMessage01 = 'Test message 01.';
    let waveTxn = await waveContract.wave(testMessage01);
    await waveTxn.wait();
    console.groupEnd();

    console.group("\nPost-wave balance:")
    const newBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Formatted balance:', hre.ethers.utils.formatEther(newBalance));
    console.groupEnd()

    console.group('\nInvoke "getTotalWaves":');
    waveCount = await waveContract.getTotalWaves(); // Log shows that this is the 'owner' waving.
    console.groupEnd();

    console.group('\nInvoke "wave" with "randomPerson":');
    const testMessage02 = 'Test message 02.'
    waveTxn = await waveContract.connect(randomPerson).wave(testMessage02); // Simulates an external person calling wave.
    await waveTxn.wait();
    console.groupEnd();

    console.group("\nPost-wave 2 balance:")
    const newBalance2 = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Formatted balance:', hre.ethers.utils.formatEther(newBalance2));
    console.groupEnd()

    console.group("\nCool-down check:")
    try {
        const testMessage03 = 'I should have failed'
        waveTxn = await waveContract.connect(randomPerson).wave(testMessage03); // Should fail as "Random Person" has waved twice within the cool-down period.
        await waveTxn.wait();
    } catch (err) {
        console.group()
        console.log(err)
        console.groupEnd()
        console.log('✅ Cool-down failed successfully.')
    }
    console.groupEnd();


    console.group('\nInvoke "getAllWaves":');
    const allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
    console.groupEnd();

    console.log('\n\n########################\n      End Run Test      \n########################\n');
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