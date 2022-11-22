import {
  Accordion,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Spinner,
} from "@chakra-ui/react"
import { Phase } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { Session, unstable_getServerSession } from "next-auth"
import { useRouter } from "next/router"
import { ChangeEventHandler, useEffect, useMemo, useState } from "react"
import CustomAccordion from "../../../components/CustomAccordion"
import PredictionForm from "../../../components/PredictionForm"
import { groupGamesByDate } from "../../../lib/groupGamesByDate"
import { GameWithTeams } from "../../../types"
import { authOptions } from "../../api/auth/[...nextauth]"

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

  const groupedGames = useMemo(() => groupGamesByDate(games), [games])

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
            <CustomAccordion key={index} group={group}>
              {group.map((game) => (
                <PredictionForm
                  key={game.id}
                  game={game}
                  userId={session.user.id}
                />
              ))}
            </CustomAccordion>
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
