// import '../styles/globals.css'
import { ChakraProvider, Container, Flex } from "@chakra-ui/react"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import Head from "next/head"
import Navbar from "../components/Navbar"
import theme from "../theme"
import Footer from "../components/Footer"

import type { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <Head>
          <title>NoterafoQuinielas</title>
          <meta name="description" content="NoTerafoQuinielas" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Flex
          direction="column"
          justifyContent="space-between"
          height="100vh"
          minH="545px"
        >
          <Navbar />
          <Container maxW="100%" width="32rem">
            <Component {...pageProps} />
          </Container>
          <Footer />
        </Flex>
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp
