import { Tournament, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  tournaments: Tournament[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const prisma = new PrismaClient()

    const tournaments = await prisma.tournament.findMany({
      where: {
        active: true,
      },
    })

    res.status(200).json({ tournaments })
  }
}
