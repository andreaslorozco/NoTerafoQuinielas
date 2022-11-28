import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react"
import { MouseEventHandler, useEffect, useState } from "react"
import { GameWithTeams } from "../types"
import PredictionScore from "./PredictionScore"
import flags from "./../lib/flags.json"

interface Props {
  game: GameWithTeams
  userId: number
}

const PredictionForm = ({ game, userId }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [homeScore, setHomeScore] = useState<number | "">(0)
  const [awayScore, setAwayScore] = useState<number | "">(0)
  const [processed, setProcessed] = useState(false)
  const [score, setScore] = useState(0)
  const [predictionFetched, setPredictionFetched] = useState(false)
  const [predictionExists, setPredictionExists] = useState(true)
  const [prediction, setPrediction] = useState(null)
  const toast = useToast()

  useEffect(() => {
    const getPrediction = async () => {
      const response = await fetch(
        `/api/prediction?user_id=${userId}&game_id=${game.id}`,
        { method: "GET" }
      )
      const { prediction } = await response.json()
      if (prediction) {
        setPrediction(prediction)
      } else {
        setPredictionExists(false)
      }
      setPredictionFetched(true)
    }
    getPrediction()
  }, [userId, game.id])

  useEffect(() => {
    if (prediction) {
      setHomeScore(prediction.home_score)
      setAwayScore(prediction.away_score)
      setProcessed(prediction.processed)
      setScore(prediction.score)
    }
  }, [prediction])

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

  const isDisabled = !predictionFetched || (prediction && prediction.processed)

  return (
    <Box>
      <FormControl display="flex" as="form" mt="1em" flexDirection="column">
        <Flex>
          <FormLabel display="flex" width="60%" mb={0} alignItems="center">
            {flags[game.home_team.name]} {game.home_team.name}
          </FormLabel>
          <Input
            type="number"
            display="inline"
            width="20%"
            my={"0.5rem"}
            value={homeScore.toString()}
            onChange={(e) => handleScoreChange(true, e.target.valueAsNumber)}
            disabled={isDisabled}
            px={1}
            textAlign="center"
          />
        </Flex>
        <Flex>
          <FormLabel display="flex" width="60%" mb={0} alignItems="center">
            {flags[game.away_team.name]} {game.away_team.name}
          </FormLabel>
          <Input
            type="number"
            display="inline"
            width="20%"
            my={"0.5rem"}
            value={awayScore.toString()}
            onChange={(e) => handleScoreChange(false, e.target.valueAsNumber)}
            disabled={isDisabled}
            px={1}
            textAlign="center"
          />
        </Flex>
        {!game.completed && (
          <Button
            colorScheme={predictionExists ? "messenger" : "red"}
            isLoading={submitting}
            type="submit"
            onClick={handleSubmit}
            width="25%"
          >
            {predictionExists ? "Save" : "Save!"}
          </Button>
        )}
      </FormControl>
      <PredictionScore processed={processed} score={score} />
    </Box>
  )
}

export default PredictionForm
