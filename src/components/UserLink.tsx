import { Link } from "@chakra-ui/react"
import NextLink from "next/link"

interface Props {
  username: string
  tournamentId: number
  userId: number
}

const UserLink = ({ username, tournamentId, userId }: Props) => {
  return (
    <NextLink href={`/tournament/${tournamentId}/user/${userId}`} passHref>
      <Link>{username}</Link>
    </NextLink>
  )
}

export default UserLink
