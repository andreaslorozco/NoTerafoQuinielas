import { Badge } from "@chakra-ui/react"
import { BADGE_COLOR_SCHEME } from "../lib/constants"

interface Props {
  processed: boolean
  score: number
}

const PredictionScore = ({ processed, score }: Props) => {
  if (!processed) return null
  return (
    <Badge colorScheme={BADGE_COLOR_SCHEME[score]}>{`+${score} points`}</Badge>
  )
}

export default PredictionScore
