import { Game, Prediction, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"
import { GameWithTeams } from "../../types"

type Data = {
  message: string
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

    const processedPredictions = unprocessedPredictions.reduce(
      (result, prediction) => {
        const game = games.find((g) => g.id === prediction.game_id)
        if (!game.completed) return result

        let finalScore = 0
        if (isPerfectScore(game, prediction)) {
          finalScore = 3
        } else if (isWinnerMatch(game, prediction)) {
          finalScore = 1
        }

        result.push({
          ...prediction,
          score: finalScore,
          processed: true,
        })
        return result
      },
      []
    )

    for (const prediction of processedPredictions) {
      await prisma.prediction.update({
        where: {
          id: prediction.id,
        },
        data: {
          score: prediction.score,
          processed: prediction.processed,
        },
      })
    }

    res.status(200).json({
      message: `Processed ${processedPredictions.length} predictions`,
    })
  }
}
