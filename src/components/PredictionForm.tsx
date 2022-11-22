import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react"
import { MouseEventHandler, useEffect, useState } from "react"
import { GameWithTeams } from "../types"

interface Props {
  game: GameWithTeams
  userId: number
}

const PredictionForm = ({ game, userId }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [homeScore, setHomeScore] = useState<number | "">(0)
  const [awayScore, setAwayScore] = useState<number | "">(0)
  const [predictionFetched, setPredictionFetched] = useState(false)
  const [predictionExists, setPredictionExists] = useState(true)
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
        setPredictionExists(false)
      }
      setPredictionFetched(true)
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
    setPredictionExists(true)
    toast({
      title: "Prediction saved",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleScoreChange = (isHomeScore: boolean, score: number) => {
    if (isHomeScore) {
      if (homeScore == 0) setHomeScore("")
      setHomeScore(score)
    } else {
      if (awayScore == 0) setAwayScore("")
      setAwayScore(score)
    }
  }

  return (
    <FormControl display="flex" as="form" mt="1em">
      <FormLabel display="flex" width="22%" mb={0} alignItems="center">
        {game.home_team.name}
      </FormLabel>
      <Input
        type="number"
        display="inline"
        width="15%"
        mr={"1em"}
        value={homeScore.toString()}
        onChange={(e) => handleScoreChange(true, e.target.valueAsNumber)}
        disabled={!predictionFetched}
        px={1}
        textAlign="center"
      />
      <FormLabel display="flex" width="22%" mb={0} alignItems="center">
        {game.away_team.name}
      </FormLabel>
      <Input
        type="number"
        display="inline"
        width="15%"
        mr={"1em"}
        value={awayScore.toString()}
        onChange={(e) => handleScoreChange(false, e.target.valueAsNumber)}
        disabled={!predictionFetched}
        px={1}
        textAlign="center"
      />
      <Button
        colorScheme={predictionExists ? "messenger" : "red"}
        isLoading={submitting}
        type="submit"
        onClick={handleSubmit}
        disabled={game.completed}
      >
        {predictionExists ? "Save" : "Save!"}
      </Button>
    </FormControl>
  )
}

export default PredictionForm
