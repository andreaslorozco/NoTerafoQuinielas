import { Phase, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data =
  | {
      phase: Phase
    }
  | {
      phases: Phase[]
    }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prisma = new PrismaClient()
  if (req.method === "GET") {
    const phases = await prisma.phase.findMany()
    res.status(200).json({ phases })
  }
  if (req.method === "POST") {
    const { tournamentId, phaseName } = JSON.parse(req.body)

    const phase = await prisma.phase.create({
      data: {
        tournament_id: tournamentId,
        name: phaseName,
      },
    })

    res.status(201).json({ phase })
  }
}
