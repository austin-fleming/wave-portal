import {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import S from '../styles/Home.module.css'
import { CONTRACT_ADDRESS } from '../contract.config'
import ABI from '../utils/abi/WavePortal.json' // artifact created when contract compiled


const getFormattedWaves = async (contract) => {
  const rawWaves = await contract.getAllWaves();

  let cleanedWaves = []
  rawWaves.forEach((wave) => {
    const rawTimestamp = new Date(wave.timestamp * 1000);
    const formattedTimestamp = rawTimestamp.toUTCString();

    cleanedWaves.push({
      sender: wave.sender,
      timestamp: formattedTimestamp,
      message: wave.message
    })
  })

  cleanedWaves.reverse();
  cleanedWaves = cleanedWaves.length > 10 ? cleanedWaves.slice(0, 10) : cleanedWaves;

  return cleanedWaves
}





const Home = () => {
  const [errorMessage, setErrorMessage] = useState("")
  const [currentAccount, setCurrentAccount] = useState("")
  const [allWaves, setAllWaves] = useState([])
  const [totalWaves, setTotalWaves] = useState(null)
  const [buttonStatusMessage, setButtonStatusMessage] = useState("Send a Wave")
  const [buttonIsActive, setButtonIsActive] = useState(true)
  const [hasErrored, setHasErrored] = useState(false)
  const [waveMessage, setWaveMessage] = useState("")

  

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
      setHasErrored(true);
      console.error(err);
    }
  }

  useEffect(() => {
    checkIfMetaMaskWalletIsConnected();
  }, [])

  const connectWalletClickHandler = async (e) => {
    e.preventDefault()

    try {
      const {ethereum} = window;

      if (!ethereum) {
        alert("Get MetaMask");
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      
      console.log("Connected", accounts[0]);
    } catch (err) {
      setHasErrored(true);
      console.log(err)
    }
  }

  const waveClickHandler = async (e) => {
    e.preventDefault()
    setButtonIsActive(false)
    setButtonStatusMessage("Waving...")
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(); //https://docs.ethers.io/v5/api/signer/#signers
        const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);

        // reading from contract is "free"
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /* execute wave. This requires notifying miners that a change has occurred. */
        const waveTxn = await wavePortalContract.wave(waveMessage);
        setButtonStatusMessage("Mining...")
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        setButtonStatusMessage("Mined...")
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        count = count.toNumber();
        setTotalWaves(count)
        console.log("Retrieved total wave count...", count);

        const cleanedWaves = await getFormattedWaves(wavePortalContract);
        setAllWaves(cleanedWaves);

        setButtonStatusMessage("Thank you!")
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      setHasErrored(true)
      console.log(err)
    }
  }

  const textAreaChange = (e) => {
    setWaveMessage(e.target.value)
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
            {
              hasErrored
                ? (
                  <div className={S.hero__buttonContainer__errored}>
                    <p className={S.hero__buttonContainer__errored__icon}>🤞</p>
                    <p>Ahhh crap...</p>
                    <p>Something didn&apos;t work.</p>
                    <p>Maybe try refreshing?</p>
                  </div>
                ) : (
                  <div className={S.hero__buttonContainer}>
                    {
                      currentAccount
                      ? (
                        <>
                          { buttonIsActive && (
                              <form>
                                <label>
                                  Your message:
                                  <textarea value={waveMessage} onChange={textAreaChange}/>
                                </label>
                              </form>
                            )
                          }
                          <button className={buttonIsActive ? S.hero__waveButton : S.hero__waveButton__inactive} onClick={waveClickHandler}>{buttonStatusMessage}</button>
                        </>
                        )
                      : (<button className={S.hero__waveButton} onClick={connectWalletClickHandler}>Connect Wallet</button>)
                    }
                    <p className={S.hero__buttonSubtext}>it&apos;ll live forever<br/>on the blockchain</p>
                  </div>
                )   
            }
            
            
        </section>
        {
          allWaves.length > 0 && (
            <section className={S.history}>
              <h1 className={S.history__title}>See who&apos;s waved recently</h1>
              <p className={S.history__totalWaves}>So far, {totalWaves} waves have been sent!</p>
              <div className={S.history__list}>
                {
                  allWaves.map((wave) => {
                    const {sender, timestamp, message} = wave

                    return (
                      <article key={`${timestamp}_${sender}`} className={S.history__record}>
                        <h1 className={S.history__message}>{message}</h1>
                        <p className={S.history__address}>from {sender}</p>
                        <p className={S.history__timestamp}>on {timestamp}</p>
                      </article>
                    )
                  })
                }
              </div>
            </section>
          )
        }
      </main>
    </>
  )
}
export default Home
