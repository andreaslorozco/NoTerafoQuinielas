import { Game, Prediction, PrismaClient, Team } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  message: string
}

interface GameWithTeams extends Game {
  home_team: Team
  away_team: Team
}

const isPerfectScore = (game: Game, prediction: Prediction) => {
  return (
    game.away_score === prediction.away_score &&
    game.home_score === prediction.home_score
  )
}

const isWinnerMatch = (game: Game, prediction: Prediction) => {
  // predicted match winner or tie
  return (
    (game.home_score > game.away_score &&
      prediction.home_score > prediction.away_score) ||
    (game.home_score === game.away_score &&
      prediction.home_score === prediction.away_score) ||
    (game.home_score < game.away_score &&
      prediction.home_score < prediction.away_score)
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { games }: { games: GameWithTeams[] } = JSON.parse(req.body)
    const prisma = new PrismaClient()

    const unprocessedPredictions = await prisma.prediction.findMany({
      where: {
        game_id: { in: games.map((g) => g.id) },
        processed: false,
      },
    })

    const processedPredictions = unprocessedPredictions.map((prediction) => {
      const game = games.find((g) => g.id === prediction.game_id)
      if (!game.completed) return prediction

      let finalScore = 0
      if (isPerfectScore(game, prediction)) {
        finalScore = 3
      } else if (isWinnerMatch(game, prediction)) {
        finalScore = 1
      }

      return {
        ...prediction,
        score: finalScore,
        processed: true,
      }
    })

    for (const processedPrediction of processedPredictions) {
      await prisma.prediction.update({
        where: {
          id: processedPrediction.id,
        },
        data: {
          score: processedPrediction.score,
          processed: processedPrediction.processed,
        },
      })
    }

    res.status(200).json({ message: "Predictions have been processed!" })
  }
}
