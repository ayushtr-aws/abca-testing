import { useState } from "react";
import { teams } from "./data/teams";
import { TeamCard } from "./components/TeamCard";
import { TeamDetail } from "./components/TeamDetail";
import {
  queryTeams,
  getCountries,
  ALL_COUNTRIES,
  type SortKey,
} from "./utils/teamQuery";
import "./App.css";

function App() {
  const [selectedTeamId, setSelectedTeamId] = useState<number>(teams[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("points");
  const [country, setCountry] = useState<string>(ALL_COUNTRIES);

  const countries = getCountries(teams);
  const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? teams[0];

  const filteredTeams = queryTeams(teams, searchQuery, sortKey, country);

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
                value={country}
                onChange={(e) => setCountry(e.target.value)}
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
