// import '../styles/globals.css'
import { ChakraProvider, Container } from "@chakra-ui/react"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import theme from "../theme"

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <Container maxW="container.md" mt={"2em"}>
          <Component {...pageProps} />
        </Container>
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp
