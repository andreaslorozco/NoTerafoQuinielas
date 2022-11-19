import { Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react"
import type { NextPage } from "next"
import { Session } from "next-auth/core/types"
import { useSession, signIn } from "next-auth/react"
import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import HomeMenuButtons from "../components/HomeMenuButtons"

const Home: NextPage = () => {
  const { data: session } = useSession()
  const prevSessionRef = useRef<Session>()
  const [loading, setLoading] = useState(false)
  const [showInitialSpinner, setShowInitialSpinner] = useState(true)

  useEffect(() => {
    prevSessionRef.current = session
    if (prevSessionRef.current === undefined && (session === null || session)) {
      setShowInitialSpinner(false)
    }
  }, [session])

  return (
    <>
      <Box as="main">
        {session && (
          <>
            <Head>
              <link rel="shortcut icon" href="/favicon.ico" sizes="any" />
            </Head>
            <Heading size="lg">
              Welcome, {session.user?.name.split(" ")[0]}!
            </Heading>
            {loading && (
              <Flex
                height="208px"
                alignItems={"center"}
                justifyContent={"center"}
                mt={"2em"}
              >
                <Spinner size="xl" />
              </Flex>
            )}
            {!loading && <HomeMenuButtons setLoading={setLoading} />}
          </>
        )}
        {!session && !showInitialSpinner && (
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
        {!session && showInitialSpinner && (
          <Flex
            height="208px"
            alignItems={"center"}
            justifyContent={"center"}
            mt={"2em"}
          >
            <Spinner size="xl" />
          </Flex>
        )}
      </Box>
    </>
  )
}

export default Home
