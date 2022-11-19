import { Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react"
import type { NextPage } from "next"
import { useSession, signIn } from "next-auth/react"

import Head from "next/head"
import { useState } from "react"
import HomeMenuButtons from "../components/HomeMenuButtons"

const Home: NextPage = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
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
