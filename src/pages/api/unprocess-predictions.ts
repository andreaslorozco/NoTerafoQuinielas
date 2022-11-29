import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"
import { GameWithTeams } from "../../types"

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { games }: { games: GameWithTeams[] } = JSON.parse(req.body)
    const prisma = new PrismaClient()

    const processedPredictions = await prisma.prediction.updateMany({
      where: {
        game_id: { in: games.map((g) => g.id) },
        processed: true,
      },
      data: {
        score: 0,
        processed: false,
      },
    })

    res.status(200).json({
      message: `Marked ${processedPredictions.count} predictions as not processed`,
    })
  }
}
