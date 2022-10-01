import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react"
import { PrismaClient, Tournament } from "@prisma/client"
import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"

const NewLobby = ({ competitions }: { competitions: Tournament[] }) => {
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
        <Button
          mt={4}
          colorScheme="teal"
          // isLoading={props.isSubmitting}
          type="submit"
        >
          Create Lobby
        </Button>
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
    },
  }
}
