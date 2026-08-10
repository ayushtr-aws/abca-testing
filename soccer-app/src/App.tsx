import { useEffect, useState } from "react";
import { teams } from "./data/teams";
import { TeamCard } from "./components/TeamCard";
import { TeamDetail } from "./components/TeamDetail";
import {
  queryTeams,
  getCountries,
  ALL_COUNTRIES,
  type SortKey,
} from "./utils/teamQuery";
import {
  buildQueryString,
  countActiveFilters,
  parseControls,
  DEFAULT_CONTROLS,
} from "./utils/urlState";
import "./App.css";

const countries = getCountries(teams);
const initialControls = parseControls(window.location.search, countries);

function App() {
  const [selectedTeamId, setSelectedTeamId] = useState<number>(teams[0].id);
  const [searchQuery, setSearchQuery] = useState(initialControls.searchQuery);
  const [sortKey, setSortKey] = useState<SortKey>(initialControls.sortKey);
  const [country, setCountry] = useState<string>(initialControls.country);

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? teams[0];

  const filteredTeams = queryTeams(teams, searchQuery, sortKey, country);

  const activeFilterCount = countActiveFilters({ searchQuery, country, sortKey });

  // Restore all controls to their defaults; the URL sync effect clears the query.
  const handleClearFilters = () => {
    setSearchQuery(DEFAULT_CONTROLS.searchQuery);
    setCountry(DEFAULT_CONTROLS.country);
    setSortKey(DEFAULT_CONTROLS.sortKey);
  };

  // Keep the URL query parameters in sync with the controls without reloading.
  useEffect(() => {
    const query = buildQueryString({ searchQuery, country, sortKey });
    const newUrl = `${window.location.pathname}${query}${window.location.hash}`;
    window.history.replaceState(null, "", newUrl);
  }, [searchQuery, country, sortKey]);

  const trimmedSearch = searchQuery.trim();
  const hasSearchFilter = trimmedSearch !== "";
  const hasCountryFilter = country !== ALL_COUNTRIES;
  const hasActiveFilters = hasSearchFilter || hasCountryFilter;

  const clearFilters = () => {
    setSearchQuery("");
    setCountry(ALL_COUNTRIES);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-icon">⚽</span>
          <div>
            <h1>Soccer Teams</h1>
            <p>Top European Club Statistics</p>
          </div>
        </div>
        <div className="header-right">
          <span className="team-count">{teams.length} Teams</span>
        </div>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-controls">
            <input
              type="text"
              placeholder="Search teams, leagues, countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="filter-controls">
              <label htmlFor="country-filter" className="filter-label">
                Country:
              </label>
              <select
                id="country-filter"
                className="country-filter"
                aria-label="Filter teams by country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && country !== ALL_COUNTRIES) {
                    e.preventDefault();
                    setCountry(ALL_COUNTRIES);
                  }
                }}
              >
                <option value={ALL_COUNTRIES}>All countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="sort-controls">
              <span className="sort-label">Sort by:</span>
              {(["points", "goals", "name", "league"] as SortKey[]).map((key) => (
                <button
                  key={key}
                  className={`sort-btn ${sortKey === key ? "active" : ""}`}
                  onClick={() => setSortKey(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <div
                className="active-filters"
                role="status"
                aria-live="polite"
              >
                <span className="active-filters-label">
                  {filteredTeams.length}{" "}
                  {filteredTeams.length === 1 ? "team" : "teams"}
                </span>
                {hasCountryFilter && (
                  <span className="filter-chip">
                    {country}
                    <button
                      type="button"
                      className="filter-chip-remove"
                      aria-label={`Clear country filter: ${country}`}
                      onClick={() => setCountry(ALL_COUNTRIES)}
                    >
                      ×
                    </button>
                  </span>
                )}
                {hasSearchFilter && (
                  <span className="filter-chip">
                    “{trimmedSearch}”
                    <button
                      type="button"
                      className="filter-chip-remove"
                      aria-label={`Clear search filter: ${trimmedSearch}`}
                      onClick={() => setSearchQuery("")}
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="filter-summary">
            <span className="active-filter-count">
              {activeFilterCount > 0
                ? `${activeFilterCount} active ${
                    activeFilterCount === 1 ? "filter" : "filters"
                  }`
                : "No active filters"}
            </span>
            <button
              type="button"
              className="clear-filters-btn"
              onClick={handleClearFilters}
              disabled={activeFilterCount === 0}
            >
              Clear filters
            </button>
          </div>

          <div className="team-list">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  isSelected={team.id === selectedTeamId}
                  onClick={() => setSelectedTeamId(team.id)}
                />
              ))
            ) : (
              <div className="no-results">
                <span>🔍</span>
                <p>
                  {searchQuery
                    ? `No teams found for "${searchQuery}"`
                    : "No teams match the selected filters"}
                </p>
              </div>
            )}
          </div>
        </aside>

        <main className="main-content">
          <TeamDetail team={selectedTeam} />
        </main>
      </div>
    </div>
  );
}

export default App;
