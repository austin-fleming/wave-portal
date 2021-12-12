import {useState} from 'react'
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

const WaveButton = () => {
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

const Home = () => (
    <>
      <main className={S.main}>
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
            <WaveButton/>
            <p className={S.hero__buttonSubtext}>it&apos;ll live forever<br/>on the blockchain</p>
        </section>
        <section className={S.history}>
          <h1 className={S.history__title}>See who&apos;s waved recently</h1>
          <div className={S.history__list}>
            {
              sampleData.map((data) => <HistoryRecord {...data}/>)
            }
          </div>
        </section>
      </main>
    </>
  )

export default Home
