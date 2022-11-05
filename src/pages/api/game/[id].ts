import { Game, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  game: Game
}

interface ParsedBody {
  homeScore: number
  awayScore: number
  gameCompleted: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const id = +req.query.id
  if (req.method === "GET") {
    const prisma = new PrismaClient()

    const game = await prisma.game.findFirst({
      where: {
        id,
      },
    })
    res.status(200).json({ game })
  }
  if (req.method === "POST") {
    const { homeScore, awayScore, gameCompleted }: ParsedBody = JSON.parse(
      req.body
    )

    const prisma = new PrismaClient()

    const updatedGame = await prisma.game.update({
      data: {
        home_score: homeScore,
        away_score: awayScore,
        completed: gameCompleted,
      },
      where: {
        id,
      },
    })
    res.status(200).json({ game: updatedGame })
  }
}
