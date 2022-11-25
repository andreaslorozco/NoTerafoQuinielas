import {
  Box,
  Button,
  Heading,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  TableContainer,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { Lobby, Prediction, User, UserLobby } from "@prisma/client"
import { Session, unstable_getServerSession } from "next-auth"
import { useRouter } from "next/router"
import { GetServerSidePropsContext } from "next/types"
import { useEffect, useState } from "react"
import { authOptions } from "../api/auth/[...nextauth]"
import NextLink from "next/link"
import SortedUsersTable from "../../components/SortedUsersTable"
import UserStats from "../../components/UserStats"

interface Props {
  session: Session
}

const LobbyPage = ({ session }: Props) => {
  const router = useRouter()
  const [lobby, setLobby] = useState<Lobby>(null)
  const [userLobby, setUserLobby] = useState<UserLobby>(null)
  const [users, setUsers] = useState<User[]>([])
  const [usersFetched, setUsersFetched] = useState(false)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [stats, setStats] = useState(null)
  const userId = session.user.id

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

    const getUsers = async () => {
      const response = await fetch(`/api/lobby/${id}/users`, { method: "GET" })
      const { users, predictions } = await response.json()
      setUsers(users)
      setPredictions(predictions)
    }
    getUsers()

    setUsersFetched(true)
  }, [router.query])

  useEffect(() => {
    const getUserStats = async () => {
      const response = await fetch(
        `/api/user/${userId}/stats?tournament=${lobby.tournament_id}`,
        {
          method: "GET",
        }
      )
      const { stats } = await response.json()
      setStats(stats)
    }
    if (lobby) getUserStats()
  }, [lobby, userId])

  useEffect(() => {
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
  }, [router.query.id, userId])

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join the Lobby!",
        url: `https://www.noterafoquinielas.com/join-lobby?id=${lobby.id}&invite_code=${lobby.invite_code}`,
      })
    }
  }

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
    <Box mt={"2em"}>
      <Heading size="lg">{lobby.name}</Heading>
      <Box mt={"2em"}>
        <StatGroup>
          <Stat>
            <StatLabel>Lobby ID</StatLabel>
            <StatNumber>{lobby.id}</StatNumber>
            <StatHelpText>
              Your friends will need this ID to join the lobby.
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Invite Code</StatLabel>
            <StatNumber>{lobby.invite_code}</StatNumber>
            <StatHelpText>
              Your friends will need this code to join the lobby.
            </StatHelpText>
          </Stat>
        </StatGroup>
      </Box>
      <Box mt={"2em"}>
        {isLobbyOwner && (
          // <NextLink href="/my-lobbies" passHref>
          <Button colorScheme="blue" w="100%" onClick={handleShareClick}>
            Send Invite
          </Button>
          // </NextLink>
        )}
        <NextLink
          href={`/tournament/${lobby.tournament_id}/prediction`}
          passHref
        >
          <Button colorScheme="messenger" w="100%" mt={"1em"}>
            Add a Prediction
          </Button>
        </NextLink>
      </Box>
      {stats && (
        <UserStats
          perfect={stats.perfect}
          good={stats.good}
          nothing={stats.nothing}
        />
      )}
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
            {usersFetched && (
              <SortedUsersTable
                users={users}
                predictions={predictions}
                lobby={lobby}
              />
            )}
            <Tfoot>
              <Tr>
                <Th>Player</Th>
                <Th isNumeric>Points</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
    </Box>
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
