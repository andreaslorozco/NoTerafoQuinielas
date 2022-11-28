import { Box, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { GameWithTeams } from "../types"
import PredictionScore from "./PredictionScore"
import flags from "./../lib/flags.json"

interface Props {
  game: GameWithTeams
  userId: number
}

const DisplayPrediction = ({ game, userId }: Props) => {
  const [homeScore, setHomeScore] = useState<number | ":(">(0)
  const [awayScore, setAwayScore] = useState<number | ":(">(0)
  const [processed, setProcessed] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const getPrediction = async () => {
      const response = await fetch(
        `/api/prediction?user_id=${userId}&game_id=${game.id}`,
        { method: "GET" }
      )
      const { prediction } = await response.json()
      if (prediction) {
        setHomeScore(prediction.home_score)
        setAwayScore(prediction.away_score)
        setProcessed(prediction.processed)
        setScore(prediction.score)
      } else {
        setHomeScore(":(")
        setAwayScore(":(")
      }
    }
    getPrediction()
  }, [userId, game.id])

  return (
    <Box>
      <FormControl display="flex" as="form" mt="1em" flexDirection="column">
        <Flex>
          <FormLabel display="flex" width="60%" mb={0} alignItems="center">
            {flags[game.home_team.name]} {game.home_team.name}
          </FormLabel>
          <Input
            display="inline"
            width="20%"
            my={"0.5rem"}
            value={homeScore.toString()}
            disabled
            px={1}
            textAlign="center"
          />
        </Flex>
        <Flex>
          <FormLabel display="flex" width="60%" mb={0} alignItems="center">
            {flags[game.away_team.name]} {game.away_team.name}
          </FormLabel>
          <Input
            display="inline"
            width="20%"
            my={"0.5rem"}
            value={awayScore.toString()}
            disabled
            px={1}
            textAlign="center"
          />
        </Flex>
      </FormControl>
      <PredictionScore processed={processed} score={score} />
    </Box>
  )
}

export default DisplayPrediction
