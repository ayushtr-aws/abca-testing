import type { Team } from "../data/teams";

export type SortKey = "points" | "goals" | "name" | "league";

/** Sentinel value representing the "All countries" filter option. */
export const ALL_COUNTRIES = "all";

/**
 * Returns the sorted, de-duplicated list of countries present in the team data.
 * Useful for populating a country filter control.
 */
export function getCountries(teams: Team[]): string[] {
  const countries = new Set(teams.map((team) => team.country));
  return Array.from(countries).sort((a, b) => a.localeCompare(b));
}

/**
 * Returns true if the team belongs to the given country.
 * The ALL_COUNTRIES sentinel matches every team.
 */
export function matchesCountry(team: Team, country: string): boolean {
  return country === ALL_COUNTRIES || team.country === country;
}

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
 * Filters teams by the search query and country, then sorts them by the given
 * sort key. Pass ALL_COUNTRIES (the default) to include every country.
 * Does not mutate the input array.
 */
export function queryTeams(
  teams: Team[],
  searchQuery: string,
  sortKey: SortKey,
  country: string = ALL_COUNTRIES
): Team[] {
  return teams
    .filter(
      (team) => matchesSearch(team, searchQuery) && matchesCountry(team, country)
    )
    .sort((a, b) => compareTeams(a, b, sortKey));
}
