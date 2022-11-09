import { Link } from "@chakra-ui/react"
import NextLink from "next/link"

interface Props {
  username: string
  tournamentId: number
  userId: number
}

const UserLink = ({ username, tournamentId, userId }: Props) => {
  const href = {
    pathname: `/tournament/${tournamentId}/user/${userId}`,
    query: {
      username,
    },
  }
  return (
    <NextLink href={href} passHref>
      <Link>{username}</Link>
    </NextLink>
  )
}

export default UserLink
