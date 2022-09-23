import { Alert, AlertIcon, Box } from "@chakra-ui/react"
import Navbar from "../components/Navbar"

const MyGroups = () => {
  return (
    <>
      <Navbar />
      <Box mt={"2rem"}>
        <Alert status="info">
          <AlertIcon />
          Groups are coming soon. Get ready!
        </Alert>
      </Box>
    </>
  )
}

export default MyGroups
