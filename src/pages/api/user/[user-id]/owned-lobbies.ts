import { PrismaClient, Lobby } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  lobbies: Lobby[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const userId = +req.query["user-id"]

    const prisma = new PrismaClient()

    const lobbies = await prisma.lobby.findMany({
      where: {
        owner_id: userId,
      },
    })

    res.status(200).json({ lobbies })
  }
}
