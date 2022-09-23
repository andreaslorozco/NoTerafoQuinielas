import type { NextPage } from "next"
import Head from "next/head"
import { useSession, signIn, signOut } from "next-auth/react"
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { data: session } = useSession()
  return (
    <div>
      <Head>
        <title>NoterafoQuinielas</title>
        <meta name="description" content="NoTerafoQuinielas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {session && (
          <>
            <h1>Welcome to NoTerafoQuinielas</h1>
            <p>
              Coming <code>soon</code>
            </p>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
      </main>
      <footer>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Built with ❤️ by andreaslorozco
          <span>
            {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
