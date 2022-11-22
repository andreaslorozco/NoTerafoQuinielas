import { GameWithTeams } from "../types"

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
