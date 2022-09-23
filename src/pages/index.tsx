import { Box, Button, Heading } from "@chakra-ui/react"
import type { NextPage } from "next"
import Head from "next/head"
import { useSession, signIn } from "next-auth/react"
import Navbar from "../components/Navbar"
import NextLink from "next/link"
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
      <Navbar />
      <Box mt={"2em"} as="main">
        {session && (
          <>
            <Heading size="lg">
              Welcome, {session.user?.name.split(" ")[0]}
            </Heading>
            <Box mt={"2em"}>
              <NextLink href="/my-groups" passHref>
                <Button colorScheme="blue">Go to My Groups</Button>
              </NextLink>
            </Box>
          </>
        )}
        {!session && (
          <>
            <Button colorScheme="blue" onClick={() => signIn()} mt={"1em"}>
              Sign in
            </Button>
          </>
        )}
      </Box>
      <footer>
        {/* <a href="#" target="_blank" rel="noopener noreferrer">
          Built with ❤️ by andreaslorozco
        </a> */}
      </footer>
    </div>
  )
}

export default Home
