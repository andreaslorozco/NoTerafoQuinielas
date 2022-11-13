import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { Game, Team } from "@prisma/client"
import { useEffect, useState } from "react"

interface Props {
  game: GameWithTeams
  userId: number
}

interface GameWithTeams extends Game {
  home_team: Team
  away_team: Team
}

const DisplayPrediction = ({ game, userId }: Props) => {
  const [homeScore, setHomeScore] = useState<number | ":(">(0)
  const [awayScore, setAwayScore] = useState<number | ":(">(0)

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
      } else {
        setHomeScore(":(")
        setAwayScore(":(")
      }
    }
    getPrediction()
  }, [userId, game.id])

  return (
    <FormControl display="flex" as="form" mt="1em">
      <FormLabel display="flex" width="25%" mb={0} alignItems="center">
        {game.home_team.name}
      </FormLabel>
      <Input
        display="inline"
        width="12%"
        mr={"1em"}
        value={homeScore.toString()}
        disabled
      />
      <FormLabel display="flex" width="25%" mb={0} alignItems="center">
        {game.away_team.name}
      </FormLabel>
      <Input
        display="inline"
        width="12%"
        mr={"1em"}
        value={awayScore.toString()}
        disabled
      />
      <Button colorScheme="teal" disabled>
        Save
      </Button>
    </FormControl>
  )
}

export default DisplayPrediction