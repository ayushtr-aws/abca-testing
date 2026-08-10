import type { Team } from "../data/teams";

export type SortKey = "points" | "goals" | "name" | "league";

/**
 * Returns true if the team matches the given search query.
 * Matching is case-insensitive and checks the team name, league and country.
 */
export function matchesSearch(team: Team, searchQuery: string): boolean {
  const query = searchQuery.toLowerCase();
  return (
    team.name.toLowerCase().includes(query) ||
    team.league.toLowerCase().includes(query) ||
    team.country.toLowerCase().includes(query)
  );
}

/**
 * Comparator for sorting teams by the given sort key.
 * - points: descending by league points
 * - goals: descending by goals scored
 * - name: ascending alphabetical by team name
 * - league: ascending alphabetical by league name
 */
export function compareTeams(a: Team, b: Team, sortKey: SortKey): number {
  switch (sortKey) {
    case "points":
      return b.stats.points - a.stats.points;
    case "goals":
      return b.stats.goalsFor - a.stats.goalsFor;
    case "name":
      return a.name.localeCompare(b.name);
    case "league":
      return a.league.localeCompare(b.league);
    default:
      return 0;
  }
}

/**
 * Filters teams by the search query and sorts them by the given sort key.
 * Does not mutate the input array.
 */
export function queryTeams(
  teams: Team[],
  searchQuery: string,
  sortKey: SortKey
): Team[] {
  return teams
    .filter((team) => matchesSearch(team, searchQuery))
    .sort((a, b) => compareTeams(a, b, sortKey));
}
