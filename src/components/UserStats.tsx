import {
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  Badge,
  Show,
} from "@chakra-ui/react"
import { BADGE_COLOR_SCHEME } from "../lib/constants"

interface Props {
  perfect: number
  good: number
  nothing: number
}

const UserStats = ({ perfect, good, nothing }: Props) => {
  return (
    <Flex mt={8} justifyContent="space-between">
      <Stat display="flex" width="auto" justifyContent="center">
        <StatLabel>Perfect Guesses (#)</StatLabel>
        <StatNumber>{perfect}</StatNumber>
        <Badge colorScheme={BADGE_COLOR_SCHEME[3]}>+3 points</Badge>
      </Stat>
      <Stat display="flex" width="auto" justifyContent="center">
        <StatLabel>Good Guesses (#)</StatLabel>
        <StatNumber>{good}</StatNumber>
        <Badge colorScheme={BADGE_COLOR_SCHEME[1]}>+1 points</Badge>
      </Stat>
      <Show above="sm">
        <Stat display="flex" width="auto" justifyContent="center">
          <StatLabel>No Guess (#) </StatLabel>
          <StatNumber>{nothing}</StatNumber>
          <Badge colorScheme={BADGE_COLOR_SCHEME[0]}>+0 points</Badge>
        </Stat>
      </Show>
    </Flex>
  )
}

export default UserStats
