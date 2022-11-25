import { PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  stats: object
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const tournamentId = +req.query["tournament"]
    const userId = +req.query["user-id"]

    const prisma = new PrismaClient()

    const { phases } = await prisma.tournament.findFirst({
      where: {
        id: tournamentId,
      },
      include: {
        phases: {
          include: {
            games: {
              include: {
                predictions: {
                  where: {
                    processed: true,
                    user_id: userId,
                  },
                },
              },
              where: {
                completed: true,
              },
            },
          },
        },
      },
    })

    const games = phases.reduce((acc, p) => {
      const games = p.games
      acc.push(...games)
      return acc
    }, [])

    const predictions = games.reduce((acc, g) => {
      const predictions = g.predictions
      acc.push(...predictions)
      return acc
    }, [])

    const stats = predictions.reduce(
      (acc, p) => {
        if (p.score === 3) acc["perfect"]++
        if (p.score === 1) acc["good"]++
        if (p.score === 0) acc["nothing"]++
        return acc
      },
      {
        ["perfect"]: 0,
        ["good"]: 0,
        ["nothing"]: 0,
      }
    )
    res.status(200).json({ stats })
  }
}
