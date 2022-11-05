import { User, PrismaClient, Prediction } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  users: User[]
  predictions: Prediction[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const id = +req.query.id

    const prisma = new PrismaClient()

    const userLobbies = await prisma.userLobby.findMany({
      where: {
        lobby_id: id,
      },
      select: {
        user: true,
      },
    })

    const { owner } = await prisma.lobby.findFirst({
      where: {
        id,
      },
      select: {
        owner: true,
      },
    })

    const lobby = await prisma.lobby.findFirst({
      where: {
        id,
      },
    })
    const { phases } = await prisma.tournament.findFirst({
      where: {
        id: lobby.tournament_id,
      },
      include: {
        phases: {
          include: {
            games: true,
          },
        },
      },
    })

    const games = phases.map((p) => p.games).flat()
    const users = [...userLobbies.map((userLobby) => userLobby.user), owner]
    const userIds = users.map((u) => u.id)
    const processedPredictions = await prisma.prediction.findMany({
      where: {
        user_id: { in: userIds },
        processed: true,
        game_id: {
          in: games.map((g) => g.id),
        },
      },
    })

    res.status(200).json({ users, predictions: processedPredictions })
  }
}
