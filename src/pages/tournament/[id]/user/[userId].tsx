import {
  Alert,
  AlertDescription,
  AlertIcon,
  Heading,
  Flex,
  FormControl,
  Select,
  Spinner,
  Accordion,
} from "@chakra-ui/react"
import { Phase } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { useRouter } from "next/router"
import { ChangeEventHandler, useEffect, useMemo, useState } from "react"
import CustomAccordion from "../../../../components/CustomAccordion"
import DisplayPrediction from "../../../../components/DisplayPrediction"
import { groupGamesByDate } from "../../../../lib/groupGamesByDate"
import { GameWithTeams } from "../../../../types"
import { authOptions } from "../../../api/auth/[...nextauth]"

const UserPage = ({ username }: { username: string }) => {
  const router = useRouter()
  const { userId } = router.query
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

  const groupedGames = useMemo(() => groupGamesByDate(games), [games])
  const defaultIndexes = useMemo(
    () => Array.from(Array(groupedGames.length).keys()),
    [groupedGames]
  )

  return (
    <div>
      <Heading as="h2" size="xl">
        {username}&apos;s predictiions
      </Heading>
      <FormControl mt={4}>
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
        {fetchingGames && (
          <Flex justifyContent={"center"} mt={4}>
            <Spinner />
          </Flex>
        )}
        {!selectedPhaseId && (
          <Alert status="error" mt={4}>
            <AlertIcon />
            <AlertDescription>
              Select a phase from the list above.
            </AlertDescription>
          </Alert>
        )}
        {!!groupedGames.length && (
          <Accordion allowMultiple defaultIndex={defaultIndexes} mt={8}>
            {groupedGames.map((group, index) => (
              <CustomAccordion key={index} group={group}>
                {group.map((game) => (
                  <DisplayPrediction
                    key={game.id}
                    game={game}
                    userId={+userId}
                  />
                ))}
              </CustomAccordion>
            ))}
          </Accordion>
        )}
      </FormControl>
    </div>
  )
}

export default UserPage

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
      username: context.query.username,
    },
  }
}
