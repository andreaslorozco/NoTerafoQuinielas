import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Tooltip,
} from "@chakra-ui/react"
import { Lobby, PrismaClient, Tournament } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { Session, unstable_getServerSession } from "next-auth"
import Router from "next/router"
import { MouseEventHandler, useState } from "react"
import { authOptions } from "./api/auth/[...nextauth]"

interface props {
  session: Session
  competitions: Tournament[]
  ownedLobbies: Lobby[]
}

const NewLobby = ({ session, competitions, ownedLobbies }: props) => {
  const [submitting, setSubmitting] = useState(false)
  const [tournamentId, setTournamentId] = useState<number>(0)
  const [name, setName] = useState("")
  const inviteCode = (Math.random() + 1).toString(36).substring(6)

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()

    if (name === "" || tournamentId === 0) return

    setSubmitting(true)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/lobby`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          tournament_id: tournamentId,
          invite_code: inviteCode,
          owner_id: session.user.id,
        }),
      }
    )
    const { newLobby } = await response.json()

    if (newLobby) {
      Router.push(`/lobby/${newLobby.id}`)
    } else {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <FormControl>
        <FormLabel>Competition</FormLabel>
        <Select
          placeholder="Select a Competition"
          onChange={(e) => setTournamentId(+e.target.value)}
          value={tournamentId}
        >
          {competitions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <FormLabel mt={4}>Name your Lobby</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Tooltip
          label="You can only create one Lobby"
          isDisabled={!ownedLobbies}
        >
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={submitting}
            type="submit"
            disabled={!!ownedLobbies}
            onClick={handleSubmit}
          >
            Create Lobby
          </Button>
        </Tooltip>
      </FormControl>
    </div>
  )
}

export default NewLobby

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  const prisma = new PrismaClient()
  const competitions = await prisma.tournament.findMany()
  const ownedLobbies = await prisma.lobby.findFirst({
    where: {
      owner_id: session.user.id,
    },
  })
  // redirect to the homepage if no session
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  return {
    props: {
      session,
      competitions,
      ownedLobbies,
    },
  }
}
