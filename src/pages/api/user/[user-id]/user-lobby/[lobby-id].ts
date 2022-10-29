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
    const inviteCode = req.body as string

    const prisma = new PrismaClient()

    const lobby = await prisma.lobby.findFirst({
      where: {
        id: lobbyId,
      },
    })

    if (!lobby) {
      return res.status(400).json({ error: "Lobby doesn't exist" })
    } else if (lobby.owner_id === userId) {
      return res.status(400).json({ error: "You can't join a lobby you own" })
    }

    const userLobby = await prisma.userLobby.findFirst({
      where: {
        user_id: userId,
        lobby_id: lobbyId,
      },
    })

    if (!userLobby && lobby.invite_code === inviteCode) {
      const joinedLobby = await prisma.userLobby.create({
        data: {
          user_id: userId,
          lobby_id: lobbyId,
        },
      })
      return res.status(201).json({ joinedLobby })
    } else if (!userLobby && lobby.invite_code !== inviteCode) {
      return res.status(400).json({ error: "Invite code doesn't match" })
    } else {
      return res.status(200).json({ joinedLobby: userLobby })
    }
  }
}
