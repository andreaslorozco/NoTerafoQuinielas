import { Prediction, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  prediction: Prediction
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const prisma = new PrismaClient()
    const { userId, gameId, homeScore, awayScore } = JSON.parse(req.body)

    const existingPrediction = await prisma.prediction.findFirst({
      where: {
        user_id: userId,
        game_id: gameId,
      },
    })

    if (existingPrediction) {
      console.log("PREDICTION FOUND")
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
      console.log("NO PREDICTION FOUND!!")
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
