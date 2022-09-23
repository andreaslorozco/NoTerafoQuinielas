import { Alert, AlertIcon, Box } from "@chakra-ui/react"
import Navbar from "../components/Navbar"

const MyLobbies = () => {
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
