import { Game, Team } from "@prisma/client"

export interface GameWithTeams extends Game {
  home_team: Team
  away_team: Team
}
