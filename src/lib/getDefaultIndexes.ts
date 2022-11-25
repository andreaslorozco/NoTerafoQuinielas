import { GameWithTeams } from "../types"

export const getDefaultIndexes = (groupedGames: GameWithTeams[][]) => {
  return groupedGames.reduce((indexes: number[], group, index) => {
    if (group.every((g) => g.completed)) return indexes
    indexes.push(index)
    return indexes
  }, [])
}
