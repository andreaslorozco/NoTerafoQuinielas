import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Spinner,
} from "@chakra-ui/react"
import { Game, Phase, Team } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { Session, unstable_getServerSession } from "next-auth"
import { useRouter } from "next/router"
import { ChangeEventHandler, useEffect, useMemo, useState } from "react"
import PredictionForm from "../../../components/PredictionForm"
import { groupGamesByDate } from "../../../lib/groupGamesByDate"
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

  const sortedGames = useMemo(() => {
    return games.sort((firstGame, secondGame) => {
      const firstDate = new Date(firstGame.date)
      const secondDate = new Date(secondGame.date)
      return firstDate.getTime() - secondDate.getTime()
    })
  }, [games])
  const groupedGames = useMemo(
    () => groupGamesByDate(sortedGames),
    [sortedGames]
  )

  const handleSelectPhase: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setGames([])
    setSelectedPhaseId(+e.target.value)
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
        <Accordion allowToggle>
          {groupedGames.map((group, index) => (
            <AccordionItem key={index}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {new Date(group[0].date).toDateString()}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {group.map((game) => (
                  <PredictionForm
                    key={game.id}
                    game={game}
                    userId={session.user.id}
                  />
                ))}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
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
