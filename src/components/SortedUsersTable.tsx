import { Tbody } from "@chakra-ui/react"
import { Lobby, Prediction, User } from "@prisma/client"
import { useMemo } from "react"
import UserRow from "./UserRow"

interface Props {
  users: User[]
  predictions: Prediction[]
  lobby: Lobby
}

const SortedUsersTable = ({ users, predictions, lobby }: Props) => {
  const memoizedSortedUsers = useMemo(() => {
    const usersWithScore = users.map((u) => {
      const score = predictions.reduce((acc, p) => {
        if (p.user_id !== u.id) return acc // don't add score if user id doesn't match prediction id
        return acc + p.score
      }, 0)
      return {
        ...u,
        score,
      }
    })
    const sortedUsers = usersWithScore.sort((a, b) => b.score - a.score)
    return sortedUsers
  }, [users, predictions])
  return (
    <Tbody>
      {memoizedSortedUsers.map((u) => {
        return <UserRow user={u} lobby={lobby} key={u.id} />
      })}
    </Tbody>
  )
}

export default SortedUsersTable
