import { Lobby, PrismaClient } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  newLobby: Lobby
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const prisma = new PrismaClient()

    const newLobby = await prisma.lobby.create({
      data: JSON.parse(req.body),
    })
    res.status(201).json({ newLobby })
  }
}
