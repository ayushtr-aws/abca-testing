import type { Team } from "../data/teams";

interface TeamDetailProps {
  team: Team;
}

const positionOrder: Record<string, number> = {
  GK: 0,
  RB: 1,
  CB: 2,
  LB: 3,
  CDM: 4,
  CM: 5,
  AM: 6,
  RW: 7,
  LW: 8,
  ST: 9,
};

const positionColors: Record<string, string> = {
  GK: "#f59e0b",
  RB: "#10b981",
  CB: "#10b981",
  LB: "#10b981",
  CDM: "#3b82f6",
  CM: "#3b82f6",
  AM: "#8b5cf6",
  RW: "#ef4444",
  LW: "#ef4444",
  ST: "#ef4444",
};

export function TeamDetail({ team }: TeamDetailProps) {
  const { stats } = team;
  const goalDiff = stats.goalsFor - stats.goalsAgainst;
  const winRate = ((stats.won / stats.played) * 100).toFixed(0);

  const sortedPlayers = [...team.players].sort(
    (a, b) => (positionOrder[a.position] ?? 99) - (positionOrder[b.position] ?? 99)
  );

  const topScorer = [...team.players].sort((a, b) => b.goals - a.goals)[0];
  const topAssister = [...team.players].sort((a, b) => b.assists - a.assists)[0];

  return (
    <div className="team-detail">
      <div
        className="team-detail-header"
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor}22 0%, ${team.secondaryColor}33 100%)`,
          borderBottom: `3px solid ${team.secondaryColor !== "#FFFFFF" ? team.secondaryColor : team.primaryColor}`,
        }}
      >
        <div className="team-detail-title">
          <span className="team-detail-logo">{team.logo}</span>
          <div>
            <h2>{team.name}</h2>
            <p className="team-detail-meta">
              {team.league} · {team.country} · Est. {team.founded}
            </p>
          </div>
        </div>
        <div className="team-detail-quick-info">
          <div className="quick-info-item">
            <span className="quick-info-icon">🏟️</span>
            <div>
              <span className="quick-info-label">Stadium</span>
              <span className="quick-info-value">{team.stadium}</span>
              <span className="quick-info-sub">{team.stadiumCapacity.toLocaleString()} capacity</span>
            </div>
          </div>
          <div className="quick-info-item">
            <span className="quick-info-icon">👔</span>
            <div>
              <span className="quick-info-label">Manager</span>
              <span className="quick-info-value">{team.manager}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="team-detail-body">
        <section className="stats-section">
          <h3>Season Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-card-value">{stats.points}</span>
              <span className="stat-card-label">Points</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-value">{stats.played}</span>
              <span className="stat-card-label">Played</span>
            </div>
            <div className="stat-card won-card">
              <span className="stat-card-value">{stats.won}</span>
              <span className="stat-card-label">Won</span>
            </div>
            <div className="stat-card drawn-card">
              <span className="stat-card-value">{stats.drawn}</span>
              <span className="stat-card-label">Drawn</span>
            </div>
            <div className="stat-card lost-card">
              <span className="stat-card-value">{stats.lost}</span>
              <span className="stat-card-label">Lost</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-value">{winRate}%</span>
              <span className="stat-card-label">Win Rate</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-value">{stats.goalsFor}</span>
              <span className="stat-card-label">Goals For</span>
            </div>
            <div className="stat-card">
              <span className="stat-card-value">{stats.goalsAgainst}</span>
              <span className="stat-card-label">Goals Against</span>
            </div>
            <div className={`stat-card ${goalDiff > 0 ? "won-card" : "lost-card"}`}>
              <span className="stat-card-value">{goalDiff > 0 ? `+${goalDiff}` : goalDiff}</span>
              <span className="stat-card-label">Goal Diff</span>
            </div>
          </div>

          <div className="form-bar">
            <div
              className="form-bar-fill won-bar"
              style={{ width: `${(stats.won / stats.played) * 100}%` }}
              title={`Won: ${stats.won}`}
            />
            <div
              className="form-bar-fill drawn-bar"
              style={{ width: `${(stats.drawn / stats.played) * 100}%` }}
              title={`Drawn: ${stats.drawn}`}
            />
            <div
              className="form-bar-fill lost-bar"
              style={{ width: `${(stats.lost / stats.played) * 100}%` }}
              title={`Lost: ${stats.lost}`}
            />
          </div>
          <div className="form-bar-legend">
            <span className="legend-item"><span className="legend-dot won-dot" /> Won</span>
            <span className="legend-item"><span className="legend-dot drawn-dot" /> Drawn</span>
            <span className="legend-item"><span className="legend-dot lost-dot" /> Lost</span>
          </div>
        </section>

        <section className="highlights-section">
          <h3>Team Highlights</h3>
          <div className="highlights-grid">
            <div className="highlight-card">
              <span className="highlight-icon">⚽</span>
              <div>
                <span className="highlight-label">Top Scorer</span>
                <span className="highlight-name">{topScorer.name}</span>
                <span className="highlight-value">{topScorer.goals} goals</span>
              </div>
            </div>
            <div className="highlight-card">
              <span className="highlight-icon">🎯</span>
              <div>
                <span className="highlight-label">Top Assister</span>
                <span className="highlight-name">{topAssister.name}</span>
                <span className="highlight-value">{topAssister.assists} assists</span>
              </div>
            </div>
          </div>
        </section>

        <section className="players-section">
          <h3>Squad ({team.players.length} players)</h3>
          <div className="players-table-wrapper">
            <table className="players-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Pos</th>
                  <th>Age</th>
                  <th>Nationality</th>
                  <th>Goals</th>
                  <th>Assists</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player) => (
                  <tr key={player.id}>
                    <td className="player-number">{player.number}</td>
                    <td className="player-name">{player.name}</td>
                    <td>
                      <span
                        className="position-badge"
                        style={{ backgroundColor: positionColors[player.position] ?? "#64748b" }}
                      >
                        {player.position}
                      </span>
                    </td>
                    <td>{player.age}</td>
                    <td>{player.nationality}</td>
                    <td className={player.goals > 0 ? "stat-highlight" : ""}>{player.goals}</td>
                    <td className={player.assists > 0 ? "stat-highlight" : ""}>{player.assists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
