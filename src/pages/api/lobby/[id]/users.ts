import { User, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  users: User[]
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

    const users = userLobbies.map((userLobby) => userLobby.user)
    res.status(200).json({ users: [...users, owner] })
  }
}
