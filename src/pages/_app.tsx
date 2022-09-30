// import '../styles/globals.css'
import { ChakraProvider, Container } from "@chakra-ui/react"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import Head from "next/head"
import Navbar from "../components/Navbar"
import theme from "../theme"

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
        <Navbar />
        <Container boxSize="lg" mt={"2em"}>
          <Component {...pageProps} />
        </Container>
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp
