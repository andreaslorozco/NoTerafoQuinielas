import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { Alert, AlertIcon, Box } from "@chakra-ui/react"
import Navbar from "../components/Navbar"

import { GetServerSidePropsContext } from "next/types"
// import { Session } from "next-auth"

const MyLobbies = () => {
  // todo: use session to fetch user lobbies?
  // { session }: { session: Session }
  return (
    <>
      <Navbar />
      <Box mt={"2rem"}>
        <Alert status="info">
          <AlertIcon />
          Lobbies are coming soon. Get ready!
        </Alert>
      </Box>
    </>
  )
}

export default MyLobbies

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
