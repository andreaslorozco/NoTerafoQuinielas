import { Game, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = { game: Game }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const prisma = new PrismaClient()
    const { phaseId, homeTeamId, awayTeamId } = JSON.parse(req.body)

    const game = await prisma.game.create({
      data: {
        phase_id: phaseId,
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        home_score: 0,
        away_score: 0,
        completed: false,
        date: new Date("2022-11-27"), // todo: actually use dates for something....
      },
    })

    res.status(201).json({ game })
  }
}
