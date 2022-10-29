import { Game, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  games: Game[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const id = +req.query.id

    const prisma = new PrismaClient()

    const games = await prisma.game.findMany({
      where: {
        phase_id: id,
      },
      include: {
        away_team: true,
        home_team: true,
      },
    })

    res.status(200).json({ games })
  }
}
