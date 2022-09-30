import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { Box, Button, Heading } from "@chakra-ui/react"

import { GetServerSidePropsContext } from "next/types"
// import { Session } from "next-auth"

const MyLobbies = () => {
  // todo: use session to fetch user lobbies?
  // { session }: { session: Session }
  return (
    <>
      <Box mt="40">
        {/* <Alert status="info">
          <AlertIcon />
          Lobbies are coming soon. Get ready!
        </Alert> */}
        <Heading size="lg" textAlign="center">
          Owned
        </Heading>
        <Box mt={"1em"}>
          <Button colorScheme="red" w="100%" mt={"1em"}>
            Lobby 1
          </Button>
        </Box>
        <Heading size="lg" textAlign="center" mt={"1em"}>
          Joined
        </Heading>
        <Box mt={"1em"}>
          <Button colorScheme="red" w="100%" mt={"1em"}>
            Lobby 1
          </Button>
          <Button colorScheme="red" w="100%" mt={"1em"}>
            Lobby 2
          </Button>
          <Button colorScheme="red" w="100%" mt={"1em"}>
            Lobby 3
          </Button>
        </Box>
        <Heading size="lg" textAlign="center" mt={"1em"}>
          More
        </Heading>
        <Box mt={"1em"}>
          <Button colorScheme="messenger" w="100%" mt={"1em"}>
            Create a Lobby
          </Button>
          <Button colorScheme="cyan" w="100%" mt={"1em"}>
            Join a Lobby
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default MyLobbies

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  // redirect to the homepage if no session
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  return {
    props: {
      session,
    },
  }
}
