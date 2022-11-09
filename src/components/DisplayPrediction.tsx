import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react"
import { Game, Team } from "@prisma/client"
import { MouseEventHandler, useEffect, useState } from "react"

interface Props {
  game: GameWithTeams
  userId: number
}

interface GameWithTeams extends Game {
  home_team: Team
  away_team: Team
}

const DisplayPrediction = ({ game, userId }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [homeScore, setHomeScore] = useState<number | ":(">(0)
  const [awayScore, setAwayScore] = useState<number | ":(">(0)
  const toast = useToast()

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

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const response = await fetch(`/api/prediction`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        gameId: game.id,
        homeScore,
        awayScore,
      }),
    })
    await response.json()
    setSubmitting(false)
    toast({
      title: "Prediction saved",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

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
      <Button
        colorScheme="teal"
        isLoading={submitting}
        type="submit"
        onClick={handleSubmit}
        disabled
      >
        Save
      </Button>
    </FormControl>
  )
}

export default DisplayPrediction
