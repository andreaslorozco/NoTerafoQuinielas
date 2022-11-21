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
import { Game, Team } from "@prisma/client"
import { MouseEventHandler, useState } from "react"

interface Props {
  game: GameWithTeams
}

interface GameWithTeams extends Game {
  home_team: Team
  away_team: Team
}

const GameForm = ({ game }: Props) => {
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
    await response.json()
    setSubmitting(false)
    toast({
      title: "Game updated",
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
      {/* <Divider my={4} /> */}
    </>
  )
}

export default GameForm
