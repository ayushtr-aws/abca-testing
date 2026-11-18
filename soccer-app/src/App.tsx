import { useState, useEffect } from "react";
import { teams } from "./data/teams";
import { TeamCard } from "./components/TeamCard";
import { TeamDetail } from "./components/TeamDetail";
import "./App.css";

/** Field the sidebar team list can be sorted by. */
type SortKey = "points" | "goals" | "name" | "league";

/**
 * Root component of the soccer-app.
 *
 * Holds all application state: the selected team, the sidebar search
 * query, the active sort key and the dark-mode toggle. It filters and sorts
 * the static `teams` data, shows the result as a list of {@link TeamCard}s
 * in the sidebar, and shows the selected team in a {@link TeamDetail} panel.
 * While dark mode is on, a `useEffect` adds the `dark-mode` class to
 * `<html>` (dark mode is on by default).
 *
 * Takes no props.
 *
 * @returns The full page layout: header, sidebar (search, sort controls,
 *   team list) and main detail panel.
 */
function App() {
  const [selectedTeamId, setSelectedTeamId] = useState<number>(teams[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("points");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply / remove the dark-mode class on <html> whenever the toggle changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? teams[0];

  const filteredTeams = teams
    .filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.league.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
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
    });

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
          <button
            className="theme-toggle"
            onClick={() => setIsDarkMode((prev) => !prev)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="theme-toggle-icon">{isDarkMode ? "☀️" : "🌙"}</span>
            {isDarkMode ? "Light mode" : "Dark mode"}
          </button>
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
                <p>No teams found for "{searchQuery}"</p>
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
