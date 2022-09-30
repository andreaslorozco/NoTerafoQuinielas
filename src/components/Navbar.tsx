import { HamburgerIcon } from "@chakra-ui/icons"
import {
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
    <Flex as="nav" height="8" alignItems="center">
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
  )
}

export default Navbar
