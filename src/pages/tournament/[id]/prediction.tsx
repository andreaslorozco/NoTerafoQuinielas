import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Tooltip,
} from "@chakra-ui/react"
import { Game, Phase, Team } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { Session, unstable_getServerSession } from "next-auth"
import Router, { useRouter } from "next/router"
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react"
import { authOptions } from "../../api/auth/[...nextauth]"

interface GameWithTeams extends Game {
  home_team: Team
  away_team: Team
}

interface Props {
  session: Session
}

const Prediction = ({ session }: Props) => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [phases, setPhases] = useState<Phase[]>([])
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(0)
  const [games, setGames] = useState<GameWithTeams[]>([])
  const [fetchingGames, setFetchingGames] = useState(false)

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

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()

    // if (name === "" || tournamentId === 0) return

    // setSubmitting(true)

    // const response = await fetch(`/api/lobby`, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     name,
    //     tournament_id: tournamentId,
    //     invite_code: inviteCode,
    //     owner_id: session.user.id,
    //   }),
    // })
    // const { newLobby } = await response.json()

    // if (newLobby) {
    //   Router.push(`/lobby/${newLobby.id}`)
    // } else {
    //   setSubmitting(false)
    // }
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
        <FormLabel mt={4}>Enter your predictions</FormLabel>
        {/* TODO */}
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
        {games.map((g) => (
          <div key={g.id}>
            {g.home_team.name} | {g.home_score} | {g.away_team.name} |{" "}
            {g.away_score}
          </div>
        ))}
        {/* <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
        <Tooltip label="Coming soon!" isDisabled={true}>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={submitting}
            type="submit"
            disabled={false}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Tooltip>
      </FormControl>
    </div>
  )
}

export default Prediction

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
