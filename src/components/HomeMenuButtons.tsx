import { Box, Button } from "@chakra-ui/react"
import NextLink from "next/link"
import { signOut } from "next-auth/react"

interface Props {
  setLoading: (boolean) => void
}

const HomeMenuButtons: React.FC<Props> = ({ setLoading }) => {
  return (
    <Box mt={"2em"}>
      <NextLink href="/my-lobbies" passHref>
        <Button colorScheme="blue" w="100%" onClick={() => setLoading(true)}>
          Go to My Lobbies
        </Button>
      </NextLink>
      <NextLink href="/new-lobby" passHref>
        <Button
          colorScheme="messenger"
          w="100%"
          mt={"1em"}
          onClick={() => setLoading(true)}
        >
          Create a Lobby
        </Button>
      </NextLink>
      <NextLink href="/join-lobby" passHref>
        <Button
          colorScheme="cyan"
          w="100%"
          mt={"1em"}
          onClick={() => setLoading(true)}
        >
          Join a Lobby
        </Button>
      </NextLink>
      <Button colorScheme="red" w="100%" mt={"1em"} onClick={() => signOut()}>
        Logout
      </Button>
    </Box>
  )
}

export default HomeMenuButtons
