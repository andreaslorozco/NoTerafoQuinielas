import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
} from "@chakra-ui/react"
import type { NextPage } from "next"
import Head from "next/head"
import { useSession, signIn, signOut } from "next-auth/react"
import { ChevronRightIcon } from "@chakra-ui/icons"
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
      <header>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Docs</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Breadcrumb</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </header>
      <main>
        {session && (
          <>
            <h1>Welcome to NoTerafoQuinielas</h1>
            <p>
              Coming <code>soon</code>
            </p>
            <Button colorScheme="blue" onClick={() => signOut()}>
              Sign out
            </Button>
          </>
        )}
        {!session && (
          <>
            Not signed in <br />
            <Button colorScheme="blue" onClick={() => signIn()}>
              Sign in
            </Button>
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
