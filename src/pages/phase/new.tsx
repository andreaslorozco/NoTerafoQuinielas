import { Button, FormControl, FormLabel, Input, Select } from "@chakra-ui/react"
import { Tournament } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { useEffect, useState } from "react"
import { authOptions } from "../api/auth/[...nextauth]"

const NewPhase = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [tournamentId, setTournamentId] = useState<number>()
  const [phaseName, setPhaseName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const getActiveTournaments = async () => {
      const response = await fetch("/api/tournament", {
        method: "GET",
      })
      const { tournaments: fetchedTournaments } = await response.json()
      setTournaments(fetchedTournaments)
    }
    getActiveTournaments()
  }, [])

  const handleSubmit = async () => {
    setSaving(true)
    const response = await fetch("/api/phase", {
      method: "POST",
      body: JSON.stringify({
        tournamentId,
        phaseName,
      }),
    })
    const { phase } = await response.json()
    if (phase) {
      setPhaseName("")
      setSaving(false)
    }
  }

  return (
    <FormControl>
      <FormLabel>Tournament:</FormLabel>
      <Select
        placeholder="Select a Tournament"
        onChange={(e) => setTournamentId(+e.currentTarget.value)}
        value={tournamentId}
        mb={4}
      >
        {tournaments.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </Select>
      <FormLabel>Phase Name</FormLabel>
      <Input
        type="text"
        value={phaseName}
        onChange={(e) => setPhaseName(e.currentTarget.value)}
        mb={4}
      />
      <Button
        disabled={saving || phaseName.length === 0 || !tournamentId}
        onClick={handleSubmit}
      >
        Create Phase
      </Button>
    </FormControl>
  )
}

export default NewPhase

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )
  // redirect to the homepage if no session
  // or if not admin (I think there's a middleware for that?)
  if (!session || session.user.role_id !== 2) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
