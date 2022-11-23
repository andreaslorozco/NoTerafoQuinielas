import { GameWithTeams } from "../types"

export const getDefaultIndexes = (groupedGames: GameWithTeams[][]) => {
  return groupedGames.reduce((indexes: number[], group, index) => {
    const groupDate = new Date(group[0].date)
    const now = new Date(Date.now())

    if (groupDate > now) indexes.push(index)
    return indexes
  }, [])
}
