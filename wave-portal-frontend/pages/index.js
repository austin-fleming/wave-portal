import {useState, useEffect} from 'react'
import Head from 'next/head'
import NextImage from 'next/image'
import S from '../styles/Home.module.css'

const sampleData = [
  {
    waveDate: `11/12/21`,
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  },
  {
    waveDate: `11/11/21`,
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
  },
  {
    waveDate: '11/10/21',
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
  }
]

const WaveButton = ({}) => {
  const [buttonWasClicked, setButtonWasClicked] = useState(false);

  const clickHandler = (e) => {
    e.preventDefault()
    setButtonWasClicked(true)
    console.log('clicked!')
  }


  return (
    <button
      className={S.hero__waveButton}
      onClick={clickHandler}
      >{
        buttonWasClicked
          ? "Thank you!"
          : "Send a Wave"
      }</button>
  )
}

const HistoryRecord = ({waveDate, address}) => (
  <div className={S.history__record}>
    <p className={S.history__date}>{waveDate}</p>
    <p className={S.history__address}>{address}</p>
  </div>
)

const Home = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [currentAccount, setCurrentAccount] = useState("")

  const checkIfMetaMaskWalletIsConnected = async () => {
    // If visitor has MetaMask installed, it injects an "ethereum" object into the window
    // This detects this object
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("No Ethereum object found in window.");
        setErrorMessage("Looks like you don't have MetaMask installed.")
        return
      } else {
        console.log("Ethereum object found", ethereum)
      }

      // Check if we are authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      // Just grabbing the first available account. There could be multiple.
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found.")
        setErrorMessage("Looks like you need to link your MetaMask first.")
      }

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    checkIfMetaMaskWalletIsConnected();
  }, [])

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        alert("Get MetaMask");
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      
      console.log("Connected", accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <main className={S.main}>
        {errorMessage && (
          <section className={S.metamaskBanner}>
            <p className={S.metamaskBanner__message}>{errorMessage}</p>
          </section>
        )}
        <section className={S.hero}>
            <span className={S.hero__hand}>👋</span>
            <h1 className={S.hero__headline}>Give Me a Hand</h1>
            <h2 className={S.hero__description}>
                I&apos;m Austin:<br/>
                an architect 🏠,<br/>
                turned designer ✍️,<br/>
                turned developer 🧑‍💻,<br/>
                turned idk anymore 🤷‍♂️
            </h2>
            <p className={S.hero__prompt}>If you&apos;d like to say hi, just hit the button below<br/>👇</p>
            {currentAccount
              ? (
                <WaveButton/>
              )
              : (
                <button className={S.hero__waveButton} onClick={connectWallet}>Connect Wallet</button>
              )
            }
            <p className={S.hero__buttonSubtext}>it&apos;ll live forever<br/>on the blockchain</p>
        </section>
        <section className={S.history}>
          <h1 className={S.history__title}>See who&apos;s waved recently</h1>
          <div className={S.history__list}>
            {
              sampleData.map((data) => <HistoryRecord key={data.waveDate} {...data}/>)
            }
          </div>
        </section>
      </main>
    </>
  )
}
export default Home
