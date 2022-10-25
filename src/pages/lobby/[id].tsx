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
import { Lobby } from "@prisma/client"
import { unstable_getServerSession } from "next-auth"
import { useRouter } from "next/router"
import { GetServerSidePropsContext } from "next/types"
import { useEffect, useState } from "react"
import { authOptions } from "../api/auth/[...nextauth]"
import NextLink from "next/link"

const LobbyPage = () => {
  const router = useRouter()
  const [lobby, setLobby] = useState<Lobby>(null)

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

  if (!lobby) return null

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
        <NextLink href="/my-lobbies" passHref>
          <Button colorScheme="blue" w="100%" disabled>
            Send Invite
          </Button>
        </NextLink>
        <NextLink href="/new-lobby" passHref>
          <Button colorScheme="messenger" w="100%" mt={"1em"} disabled>
            Add a Guess
          </Button>
        </NextLink>
      </Box>
      <Box mt={"2em"}>
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
