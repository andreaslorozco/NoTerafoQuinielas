import { Session, unstable_getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import { Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react"
import NextLink from "next/link"
import { GetServerSidePropsContext } from "next/types"
import { useEffect, useState } from "react"
import { Lobby } from "@prisma/client"

interface Props {
  session: Session
}

const MyLobbies = ({ session }: Props) => {
  const [ownedLobbies, setOwnedLobbies] = useState<Lobby[]>([])
  const [ownedLobbiesFetched, setOwnedLobbiesFetched] = useState(false)
  const [joinedLobbies, setJoinedLobbies] = useState<Lobby[]>([])
  const [joinedLobbiesFetched, setFetchedLobbiesFetched] = useState(false)

  useEffect(() => {
    const getOwnedLobbies = async () => {
      const response = await fetch(
        `/api/user/${session.user.id}/owned-lobbies`,
        {
          method: "GET",
        }
      )
      const { lobbies: fetchedOwnedLobbies } = await response.json()
      if (fetchedOwnedLobbies) setOwnedLobbies(fetchedOwnedLobbies)
      setOwnedLobbiesFetched(true)
    }
    const getJoinedLobbies = async () => {
      const response = await fetch(
        `/api/user/${session.user.id}/joined-lobbies`,
        {
          method: "GET",
        }
      )
      const { lobbies: fetchedJoinedLobbies } = await response.json()
      if (fetchedJoinedLobbies) setJoinedLobbies(fetchedJoinedLobbies)
      setFetchedLobbiesFetched(true)
    }
    getOwnedLobbies()
    getJoinedLobbies()
  }, [session.user.id])

  return (
    <Box mt={"2em"}>
      <Heading size="lg" textAlign="center">
        Owned
      </Heading>
      <Box mt={"1em"}>
        {ownedLobbies.map((l) => (
          <NextLink href={`/lobby/${l.id}`} passHref key={l.id}>
            <Button colorScheme="red" w="100%" mt={"1em"}>
              {l.name}
            </Button>
          </NextLink>
        ))}
        {ownedLobbies.length === 0 && ownedLobbiesFetched && (
          <Button colorScheme="red" w="100%" mt={"1em"} disabled>
            No Lobbies Found
          </Button>
        )}
        {!ownedLobbiesFetched && (
          <Flex justifyContent={"center"}>
            <Spinner />
          </Flex>
        )}
      </Box>
      <Heading size="lg" textAlign="center" mt={"1em"}>
        Joined
      </Heading>
      <Box mt={"1em"}>
        {joinedLobbies.map((l) => (
          <NextLink href={`/lobby/${l.id}`} passHref key={l.id}>
            <Button colorScheme="red" w="100%" mt={"1em"}>
              {l.name}
            </Button>
          </NextLink>
        ))}
        {joinedLobbies.length === 0 && joinedLobbiesFetched && (
          <Button colorScheme="red" w="100%" mt={"1em"} disabled>
            No Lobbies Found
          </Button>
        )}
        {!joinedLobbiesFetched && (
          <Flex justifyContent={"center"}>
            <Spinner />
          </Flex>
        )}
      </Box>
      <Heading size="lg" textAlign="center" mt={"1em"}>
        More
      </Heading>
      <Box mt={"1em"}>
        <NextLink href="/new-lobby" passHref>
          <Button colorScheme="messenger" w="100%" mt={"1em"}>
            Create a Lobby
          </Button>
        </NextLink>
        <NextLink href="/join-lobby" passHref>
          <Button colorScheme="cyan" w="100%" mt={"1em"}>
            Join a Lobby
          </Button>
        </NextLink>
      </Box>
    </Box>
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
