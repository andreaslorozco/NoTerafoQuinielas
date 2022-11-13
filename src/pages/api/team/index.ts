import { Team, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = { teams: Team[] }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const prisma = new PrismaClient()

    const teams = await prisma.team.findMany()

    res.status(201).json({ teams })
  }
}
