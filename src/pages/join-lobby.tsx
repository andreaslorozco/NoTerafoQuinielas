import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { GetServerSidePropsContext } from "next"
import { Session, unstable_getServerSession } from "next-auth"
import Router from "next/router"
import { MouseEventHandler, useState } from "react"
import { authOptions } from "./api/auth/[...nextauth]"

interface props {
  session: Session
}

const JoinLobby = ({ session }: props) => {
  const [submitting, setSubmitting] = useState(false)
  const [id, setId] = useState<string>("")
  const [inviteCode, setInviteCode] = useState<string>("")

  const isFormIncomplete = id === "" || inviteCode === ""

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()

    if (isFormIncomplete) return

    setSubmitting(true)

    const response = await fetch(
      `/api/user/${session.user.id}/user-lobby/${id}`,
      {
        method: "POST",
      }
    )
    const { joinedLobby } = await response.json()

    if (joinedLobby) {
      Router.push(`/lobby/${id}`)
    } else {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <FormControl>
        <FormLabel mt={4}>Lobby ID</FormLabel>
        <Input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        <FormLabel mt={4}>Invite Code</FormLabel>
        <Input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={submitting}
          type="submit"
          disabled={isFormIncomplete || submitting}
          onClick={handleSubmit}
        >
          Join Lobby
        </Button>
      </FormControl>
    </div>
  )
}

export default JoinLobby

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
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
    },
  }
}
