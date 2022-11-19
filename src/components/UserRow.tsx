import { Td, Tr } from "@chakra-ui/react"
import { Lobby, User } from "@prisma/client"
import UserLink from "./UserLink"

interface UserWithScore extends User {
  score: number
}

interface Props {
  user: UserWithScore
  lobby: Lobby
}

const UserRow = ({ user, lobby }: Props) => {
  return (
    <Tr>
      <Td>
        <UserLink
          username={user.name.split(" ")[0]}
          tournamentId={lobby.tournament_id}
          userId={user.id}
        />
      </Td>
      <Td isNumeric>{user.score}</Td>
    </Tr>
  )
}

export default UserRow
