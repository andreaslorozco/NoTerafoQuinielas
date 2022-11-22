import { Game, Team } from "@prisma/client"

interface GameWithTeams extends Game {
  home_team: Team
  away_team: Team
}

export const groupGamesByDate = (games: GameWithTeams[]) => {
  return games.reduce((groupedGames: GameWithTeams[][], game, index, games) => {
    if (index === 0) {
      groupedGames.push([game])
      return groupedGames
    }

    const currentDateString = new Date(game.date).toDateString()
    const previousDateString = new Date(games[index - 1].date).toDateString()
    if (currentDateString === previousDateString) {
      groupedGames[groupedGames.length - 1].push(game)
    } else {
      groupedGames.push([game])
    }

    return groupedGames
  }, [])
}
