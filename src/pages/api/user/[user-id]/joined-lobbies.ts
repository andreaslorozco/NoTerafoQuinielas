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

    const selectedLobbies = await prisma.userLobby.findMany({
      where: {
        user_id: userId,
      },
      select: {
        lobby: true,
      },
    })

    res.status(200).json({ lobbies: selectedLobbies.map((sl) => sl.lobby) })
  }
}
