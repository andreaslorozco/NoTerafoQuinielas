import { PrismaClient, UserLobby } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  userLobby: UserLobby
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const userId = +req.query["user-id"]
    const lobbyId = +req.query["lobby-id"]

    const prisma = new PrismaClient()

    const userLobby = await prisma.userLobby.findFirst({
      where: {
        user_id: userId,
        lobby_id: lobbyId,
      },
    })

    res.status(200).json({ userLobby })
  }
}
