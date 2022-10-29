import { Phase, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  phases: Phase[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const id = +req.query.id

    const prisma = new PrismaClient()

    const phases = await prisma.phase.findMany({
      where: {
        tournament_id: id,
      },
    })

    res.status(200).json({ phases })
  }
}
