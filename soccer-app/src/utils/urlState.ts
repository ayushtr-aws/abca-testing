import { ALL_COUNTRIES, isSortKey, type SortKey } from "./teamQuery";

/** Names of the URL query parameters used to persist browser controls. */
export const PARAM_SEARCH = "q";
export const PARAM_COUNTRY = "country";
export const PARAM_SORT = "sort";

/** The state of the browser controls that is persisted in the URL. */
export interface BrowserControls {
  searchQuery: string;
  country: string;
  sortKey: SortKey;
}

/** Default control values used when no valid URL parameter is present. */
export const DEFAULT_CONTROLS: BrowserControls = {
  searchQuery: "",
  country: ALL_COUNTRIES,
  sortKey: "points",
};

/**
 * Parses browser controls from a URL query string, ignoring invalid values.
 *
 * - The search query is taken verbatim (any string is valid).
 * - The country is only accepted if it appears in `validCountries` (or is the
 *   ALL_COUNTRIES sentinel); otherwise it falls back to the default.
 * - The sort key is only accepted if it is a recognised SortKey.
 *
 * @param search   The `location.search` string (e.g. "?q=arsenal&sort=name").
 * @param validCountries The list of selectable country values.
 */
export function parseControls(
  search: string,
  validCountries: string[]
): BrowserControls {
  const params = new URLSearchParams(search);

  const rawSearch = params.get(PARAM_SEARCH);
  const searchQuery = rawSearch ?? DEFAULT_CONTROLS.searchQuery;

  const rawCountry = params.get(PARAM_COUNTRY);
  const country =
    rawCountry === ALL_COUNTRIES ||
    (rawCountry !== null && validCountries.includes(rawCountry))
      ? rawCountry
      : DEFAULT_CONTROLS.country;

  const rawSort = params.get(PARAM_SORT);
  const sortKey = isSortKey(rawSort) ? rawSort : DEFAULT_CONTROLS.sortKey;

  return { searchQuery, country, sortKey };
}

/**
 * Builds a URL query string (including the leading "?" when non-empty) that
 * represents the given controls. Values equal to their defaults are omitted to
 * keep the URL clean.
 */
export function buildQueryString(controls: BrowserControls): string {
  const params = new URLSearchParams();

  if (controls.searchQuery !== DEFAULT_CONTROLS.searchQuery) {
    params.set(PARAM_SEARCH, controls.searchQuery);
  }
  if (controls.country !== DEFAULT_CONTROLS.country) {
    params.set(PARAM_COUNTRY, controls.country);
  }
  if (controls.sortKey !== DEFAULT_CONTROLS.sortKey) {
    params.set(PARAM_SORT, controls.sortKey);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}
