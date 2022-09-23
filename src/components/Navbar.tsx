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
import { signOut } from "next-auth/react"

const Navbar = () => {
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
          <CustomMenuItem to="/my-groups">My Groups</CustomMenuItem>
          <CustomMenuItem onClick={() => signOut()}>Logout</CustomMenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default Navbar
