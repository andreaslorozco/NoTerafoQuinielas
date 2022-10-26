import { Lobby, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  lobby: Lobby
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const id = +req.query.id

    const prisma = new PrismaClient()

    const lobby = await prisma.lobby.findFirst({
      where: {
        id,
      },
    })
    res.status(200).json({ lobby })
  }
}
