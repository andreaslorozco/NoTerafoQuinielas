import {
  Box,
  Button,
  Heading,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { Lobby, UserLobby } from "@prisma/client"
import { Session, unstable_getServerSession } from "next-auth"
import { useRouter } from "next/router"
import { GetServerSidePropsContext } from "next/types"
import { useEffect, useState } from "react"
import { authOptions } from "../api/auth/[...nextauth]"
import NextLink from "next/link"

interface Props {
  session: Session
}

const LobbyPage = ({ session }: Props) => {
  const router = useRouter()
  const [lobby, setLobby] = useState<Lobby>(null)
  const [userLobby, setUserLobby] = useState<UserLobby>(null)

  useEffect(() => {
    const { id } = router.query
    const getLobby = async () => {
      const response = await fetch(`/api/lobby/${id}`, {
        method: "GET",
      })
      const { lobby } = await response.json()
      setLobby(lobby)
    }
    getLobby()
  }, [router.query])

  useEffect(() => {
    const userId = session.user.id
    const userLobbyId = router.query.id
    const getUserLobby = async () => {
      const response = await fetch(
        `/api/user/${userId}/user-lobby/${userLobbyId}`,
        {
          method: "GET",
        }
      )
      const { userLobby } = await response.json()
      setUserLobby(userLobby)
    }
    getUserLobby()
  })

  // return nothing if lobby doesn't exist
  if (!lobby) return null

  // return join lobby form if lobby exist and
  // user is not part of lobby or user is not lobby owner
  const isLobbyOwner = lobby?.owner_id === session.user.id
  if (!userLobby && !isLobbyOwner) {
    return (
      <NextLink href="/join-lobby/5" passHref>
        <Button colorScheme="blue" w="100%">
          Join this Lobby
        </Button>
      </NextLink>
    )
  }

  return (
    <>
      <Heading size="lg">{lobby.name}</Heading>
      <Box mt={"2em"}>
        <Stat>
          <StatLabel>Invite Code</StatLabel>
          <StatNumber>{lobby.invite_code}</StatNumber>
          <StatHelpText>
            Your friends will need this code to join the lobby.
          </StatHelpText>
        </Stat>
      </Box>
      <Box mt={"2em"}>
        {isLobbyOwner && (
          <NextLink href="/my-lobbies" passHref>
            <Button colorScheme="blue" w="100%" disabled>
              Send Invite
            </Button>
          </NextLink>
        )}
        <NextLink href="/new-lobby" passHref>
          <Button colorScheme="messenger" w="100%" mt={"1em"} disabled>
            Add a Guess
          </Button>
        </NextLink>
      </Box>
      <Box mt={"2em"}>
        {/* TODO: make dynamic */}
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Ranking</TableCaption>
            <Thead>
              <Tr>
                <Th>Player</Th>
                <Th isNumeric>Points</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Marcelo</Td>
                <Td isNumeric>25</Td>
              </Tr>
              <Tr>
                <Td>Diego</Td>
                <Td isNumeric>25</Td>
              </Tr>
              <Tr>
                <Td>Andreas</Td>
                <Td isNumeric>25</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Player</Th>
                <Th isNumeric>Points</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}

export default LobbyPage

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
