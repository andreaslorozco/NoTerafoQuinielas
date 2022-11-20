import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Spinner,
} from "@chakra-ui/react"
import { Game, Phase, Team } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { useRouter } from "next/router"
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react"
import GameForm from "../../../components/GameForm"
import { authOptions } from "../../api/auth/[...nextauth]"

interface GameWithTeams extends Game {
  home_team: Team
  away_team: Team
}

const GameAdminPage = () => {
  const router = useRouter()
  const [phases, setPhases] = useState<Phase[]>([])
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(0)
  const [games, setGames] = useState<GameWithTeams[]>([])
  const [fetchingGames, setFetchingGames] = useState(false)
  const [processingGames, setProcessingGames] = useState(false)

  useEffect(() => {
    const { id } = router.query
    const getPhases = async () => {
      const response = await fetch(`/api/tournament/${id}/phases`, {
        method: "GET",
      })
      const { phases } = await response.json()
      setPhases(phases)
    }
    getPhases()
  }, [router.query])

  useEffect(() => {
    const getGames = async () => {
      setFetchingGames(true)
      const response = await fetch(`/api/phase/${selectedPhaseId}/games`, {
        method: "GET",
      })
      const { games } = await response.json()
      setGames(games)
      setFetchingGames(false)
    }
    if (selectedPhaseId) getGames()
  }, [selectedPhaseId])

  const handleSelectPhase: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setGames([])
    setSelectedPhaseId(+e.target.value)
  }

  const handleProcessScores: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    setProcessingGames(true)
    const completedGames = games.filter((g) => g.completed)
    const response = await fetch("/api/process-scores", {
      method: "POST",
      body: JSON.stringify({ games: completedGames }),
    })
    await response.json()
    setProcessingGames(false)
  }

  return (
    <div>
      <FormControl>
        <FormLabel>Stage</FormLabel>
        <Select
          placeholder="Select a Stage"
          onChange={handleSelectPhase}
          value={selectedPhaseId}
        >
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <FormLabel mt={4}>Modify Game Scores</FormLabel>
        {fetchingGames && (
          <Flex justifyContent={"center"}>
            <Spinner />
          </Flex>
        )}
        {!selectedPhaseId && (
          <Button colorScheme="blue" w="100%" disabled>
            Select a Stage from the list above
          </Button>
        )}
        {!!selectedPhaseId && games.length > 0 && (
          <Button
            colorScheme="blue"
            w="100%"
            onClick={handleProcessScores}
            disabled={processingGames}
          >
            Process Scores
          </Button>
        )}
        {games.map((g) => (
          <GameForm key={g.id} game={g} />
        ))}
      </FormControl>
    </div>
  )
}

export default GameAdminPage

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
