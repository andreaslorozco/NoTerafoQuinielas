import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Tooltip,
} from "@chakra-ui/react"
import { Lobby, PrismaClient, Tournament } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"

interface props {
  competitions: Tournament[]
  ownedLobbies: Lobby[]
}

const NewLobby = ({ competitions, ownedLobbies }: props) => {
  return (
    <div>
      <FormControl>
        <FormLabel>Competition</FormLabel>
        <Select placeholder="Select a Competition">
          {competitions.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </Select>
        <FormLabel mt={4}>Name your Lobby</FormLabel>
        <Input type="text" />
        {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
        <Tooltip
          label="You can only create one Lobby"
          isDisabled={!ownedLobbies}
        >
          <Button
            mt={4}
            colorScheme="teal"
            // isLoading={props.isSubmitting}
            type="submit"
            disabled={!!ownedLobbies}
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
      competitions,
      ownedLobbies,
    },
  }
}
