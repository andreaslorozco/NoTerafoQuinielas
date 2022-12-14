import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Tooltip,
  useToast,
} from "@chakra-ui/react"
import { MouseEventHandler, useState } from "react"
import { GameWithTeams } from "../types"

interface Props {
  game: GameWithTeams
  updateGame: (updatedGame: GameWithTeams) => void
}

const GameForm = ({ game, updateGame }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [homeScore, setHomeScore] = useState(game.home_score)
  const [awayScore, setAwayScore] = useState(game.away_score)
  const [date, setDate] = useState<string | Date>(game.date)
  const [gameCompleted, setGameCompleted] = useState(!!game.completed)
  const toast = useToast()

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const response = await fetch(`/api/game/${game.id}`, {
      method: "PUT",
      body: JSON.stringify({
        homeScore,
        awayScore,
        gameCompleted,
        date,
      }),
    })
    const data = await response.json()
    updateGame({ ...game, ...data.game })
    setSubmitting(false)
    toast({
      title: "Game updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleProcessPredictions: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    const response = await fetch("/api/process-predictions", {
      method: "POST",
      body: JSON.stringify({ games: [game] }),
    })
    const { message } = await response.json()
    toast({
      title: message,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleUnprocessPredictions: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    const response = await fetch("/api/unprocess-predictions", {
      method: "POST",
      body: JSON.stringify({ games: [game] }),
    })
    const { message } = await response.json()
    toast({
      title: message,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <>
      <Divider my={4} />
      <FormControl as="form" mt="1em">
        <Box display="flex">
          <FormLabel display="flex" width="22%" mb={0} alignItems="center">
            {game.home_team.name}
          </FormLabel>
          <Input
            type="number"
            display="inline"
            width="15%"
            mr={"1em"}
            value={homeScore.toString()}
            onChange={(e) => setHomeScore(e.target.valueAsNumber)}
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
            onChange={(e) => setAwayScore(e.target.valueAsNumber)}
            px={1}
            textAlign="center"
          />
          <Tooltip label="Completed?">
            <Checkbox
              mr={"1em"}
              isChecked={gameCompleted}
              onChange={(e) => setGameCompleted(e.target.checked)}
            />
          </Tooltip>
          <Button
            colorScheme="messenger"
            isLoading={submitting}
            type="submit"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Box>
        <FormLabel mt={2}>Date</FormLabel>
        <Input
          type="text"
          value={date.toString()}
          onChange={(e) => setDate(e.target.value)}
        />
      </FormControl>
      <Button
        mt={4}
        colorScheme="cyan"
        onClick={handleProcessPredictions}
        isLoading={submitting}
      >
        Process Predictions For This Game
      </Button>
      <Button
        mt={4}
        colorScheme="pink"
        onClick={handleUnprocessPredictions}
        isLoading={submitting}
      >
        Mark Predictions as Unprocessed
      </Button>
    </>
  )
}

export default GameForm
