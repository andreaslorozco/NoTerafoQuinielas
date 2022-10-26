import { PrismaClient, UserLobby } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  userLobby?: UserLobby
  error?: string
  joinedLobby?: UserLobby
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
  if (req.method === "POST") {
    const userId = +req.query["user-id"]
    const lobbyId = +req.query["lobby-id"]

    const prisma = new PrismaClient()

    const lobby = await prisma.lobby.findFirst({
      where: {
        id: lobbyId,
      },
    })

    if (!lobby) {
      return res.status(400).json({ error: "Lobby doesn't exist" })
    }

    const userLobby = await prisma.userLobby.findFirst({
      where: {
        user_id: userId,
        lobby_id: lobbyId,
      },
    })

    if (!userLobby) {
      const joinedLobby = await prisma.userLobby.create({
        data: {
          user_id: userId,
          lobby_id: lobbyId,
        },
      })
      return res.status(201).json({ joinedLobby })
    } else {
      return res.status(200).json({ joinedLobby: userLobby })
    }
  }
}
