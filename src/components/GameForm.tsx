import {
  Button,
  Checkbox,
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
  const [gameCompleted, setGameCompleted] = useState(!!game.completed)
  const toast = useToast()

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const response = await fetch(`/api/game/${game.id}`, {
      method: "POST",
      body: JSON.stringify({
        homeScore,
        awayScore,
        gameCompleted,
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
    </FormControl>
  )
}

export default GameForm
