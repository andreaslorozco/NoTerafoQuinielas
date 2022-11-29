import { Prediction, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

interface PredictionInterface {
  prediction: Prediction
}

interface Error {
  message: string
}

type Data = PredictionInterface | Error

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prisma = new PrismaClient()
  if (req.method === "GET") {
    const { user_id: userId, game_id: gameId } = req.query
    const prediction = await prisma.prediction.findFirst({
      where: {
        user_id: +userId,
        game_id: +gameId,
      },
    })
    res.status(200).json({ prediction })
  }
  if (req.method === "POST") {
    const { userId, gameId, homeScore, awayScore } = JSON.parse(req.body)

    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
      },
      include: {
        predictions: {
          where: {
            user_id: userId,
          },
        },
      },
    })

    if (game.completed) {
      return res
        .status(403)
        .json({ message: "It's too late to submit a prediction for this game" })
    }

    const existingPrediction = game.predictions[0]
    if (existingPrediction) {
      const prediction = await prisma.prediction.update({
        data: {
          home_score: homeScore,
          away_score: awayScore,
        },
        where: {
          id: existingPrediction.id,
        },
      })
      res.status(200).json({ prediction })
    } else {
      const prediction = await prisma.prediction.create({
        data: {
          home_score: homeScore,
          away_score: awayScore,
          user_id: userId,
          game_id: gameId,
          score: 0,
        },
      })
      res.status(200).json({ prediction })
    }
  }
}
