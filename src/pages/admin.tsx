import { Text, Box, Button, Code, Heading } from "@chakra-ui/react"
import type { GetServerSidePropsContext, NextPage } from "next"
import NextLink from "next/link"
import Head from "next/head"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"

const AdminPage: NextPage = () => {
  return (
    <Box as="main">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" sizes="any" />
      </Head>
      <Heading size="lg">Admin Zone!</Heading>
      <Box mt={"2em"}>
        <NextLink href="/phase/new" passHref>
          <Button colorScheme="blue" w="100%">
            Create a Phase
          </Button>
        </NextLink>
        <NextLink href="/game/new" passHref>
          <Button colorScheme="messenger" w="100%" mt={"1em"}>
            Create a Game
          </Button>
        </NextLink>
        <Text mt={4}>
          To process/modify games, go to <Code>/tournament/[id]/games</Code>
        </Text>
      </Box>
    </Box>
  )
}

export default AdminPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  // redirect to the homepage if no session
  // or if not admin (I think there's a middleware for that?)
  if (!session || session.user.role_id !== 2) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
