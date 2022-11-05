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
}

interface GameWithTeams extends Game {
  home_team: Team
  away_team: Team
}

const GameForm = ({ game }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [gameFetched, setGameFetched] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const getGame = async () => {
      const response = await fetch(`/api/game/${game.id}`, { method: "GET" })
      const { game: fetchedGame } = await response.json()
      if (fetchedGame) {
        setHomeScore(fetchedGame.home_score)
        setAwayScore(fetchedGame.away_score)
      }
      setGameFetched(true)
    }
    getGame()
  }, [game.id])

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const response = await fetch(`/api/game/${game.id}`, {
      method: "POST",
      body: JSON.stringify({
        homeScore,
        awayScore,
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
      <FormLabel display="flex" width="25%" mb={0} alignItems="center">
        {game.home_team.name}
      </FormLabel>
      <Input
        type="number"
        display="inline"
        width="12%"
        mr={"1em"}
        value={homeScore.toString()}
        onChange={(e) => setHomeScore(e.target.valueAsNumber)}
        disabled={!gameFetched}
      />
      <FormLabel display="flex" width="25%" mb={0} alignItems="center">
        {game.away_team.name}
      </FormLabel>
      <Input
        type="number"
        display="inline"
        width="12%"
        mr={"1em"}
        value={awayScore.toString()}
        onChange={(e) => setAwayScore(e.target.valueAsNumber)}
        disabled={!gameFetched}
      />
      <Button
        colorScheme="teal"
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
