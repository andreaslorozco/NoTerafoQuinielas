import { HamburgerIcon } from "@chakra-ui/icons"
import {
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react"
import CustomMenuItem from "./CustomMenuItem"
import { signIn, signOut, useSession } from "next-auth/react"

const Navbar = () => {
  const { data: session } = useSession()
  return (
    <Container as="nav" maxW="container.md" height="8" mt="1em">
      <Flex alignItems="center">
        <Menu>
          <Text fontSize="lg" fontWeight="bold">
            NoterafoQuinielas
          </Text>
          <Spacer />
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            <CustomMenuItem to="/">Home</CustomMenuItem>
            {session && (
              <CustomMenuItem to="/my-lobbies">My Lobbies</CustomMenuItem>
            )}
            {!session && (
              <CustomMenuItem onClick={() => signIn()}>Log in</CustomMenuItem>
            )}
            {session && (
              <CustomMenuItem onClick={() => signOut()}>Logout</CustomMenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>
    </Container>
  )
}

export default Navbar
