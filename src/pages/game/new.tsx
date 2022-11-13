import { Button, FormControl, FormLabel, Select } from "@chakra-ui/react"
import { Phase, Team } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { useEffect, useState } from "react"
import { authOptions } from "../api/auth/[...nextauth]"

const NewGame = () => {
  const [phases, setPhases] = useState<Phase[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [phaseId, setPhaseId] = useState<number>()
  const [homeTeamId, setHomeTeamId] = useState<number | "">()
  const [awayTeamId, setAwayTeamId] = useState<number | "">()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const getPhases = async () => {
      const response = await fetch("/api/phase", {
        method: "GET",
      })
      const { phases: fetchedPhases } = await response.json()
      setPhases(fetchedPhases)
    }
    const getTeams = async () => {
      const response = await fetch("/api/team", {
        method: "GET",
      })
      const { teams: fetchedTeams } = await response.json()
      setTeams(fetchedTeams)
    }
    getPhases()
    getTeams()
  }, [])

  const handleSubmit = async () => {
    setSaving(true)
    const response = await fetch("/api/game", {
      method: "POST",
      body: JSON.stringify({
        phaseId,
        homeTeamId,
        awayTeamId,
      }),
    })
    const { game } = await response.json()
    if (game) {
      setHomeTeamId("")
      setAwayTeamId("")
      setSaving(false)
    }
  }

  return (
    <FormControl>
      <FormLabel>Phase:</FormLabel>
      <Select
        placeholder="Select a Phase"
        onChange={(e) => setPhaseId(+e.currentTarget.value)}
        value={phaseId}
        mb={4}
      >
        {phases.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>
      <FormLabel>Home Team:</FormLabel>
      <Select
        placeholder="Select Home Team"
        onChange={(e) => setHomeTeamId(+e.currentTarget.value)}
        value={homeTeamId}
        mb={4}
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </Select>
      <FormLabel>Away Team:</FormLabel>
      <Select
        placeholder="Select Away Team"
        onChange={(e) => setAwayTeamId(+e.currentTarget.value)}
        value={awayTeamId}
        mb={4}
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </Select>
      <Button
        disabled={saving || !phaseId || !homeTeamId || !awayTeamId}
        onClick={handleSubmit}
      >
        Create Game
      </Button>
    </FormControl>
  )
}

export default NewGame

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
