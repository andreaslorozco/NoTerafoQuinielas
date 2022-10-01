import { Box, Button, Heading } from "@chakra-ui/react"
import type { NextPage } from "next"
import { useSession, signIn, signOut } from "next-auth/react"
import NextLink from "next/link"
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { data: session } = useSession()
  return (
    <>
      <Box as="main">
        {session && (
          <>
            <Heading size="lg">
              Welcome, {session.user?.name.split(" ")[0]}!
            </Heading>
            <Box mt={"2em"}>
              <NextLink href="/my-lobbies" passHref>
                <Button colorScheme="blue" w="100%">
                  Go to My Lobbies
                </Button>
              </NextLink>
              <NextLink href="/new-lobby" passHref>
                <Button colorScheme="messenger" w="100%" mt={"1em"}>
                  Create a Lobby
                </Button>
              </NextLink>
              <NextLink href="/my-lobbies" passHref>
                <Button colorScheme="cyan" w="100%" mt={"1em"}>
                  Join a Lobby
                </Button>
              </NextLink>
              <Button
                colorScheme="red"
                w="100%"
                mt={"1em"}
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </Box>
          </>
        )}
        {!session && (
          <>
            <Heading size="lg">Welcome, stranger!</Heading>
            <Button
              colorScheme="yellow"
              onClick={() => signIn()}
              mt={"1em"}
              w="100%"
            >
              Sign in to get started
            </Button>
          </>
        )}
      </Box>
    </>
  )
}

export default Home
