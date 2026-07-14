import type { Team } from "../data/teams";

interface TeamCardProps {
  team: Team;
  isSelected: boolean;
  onClick: () => void;
}

export function TeamCard({ team, isSelected, onClick }: TeamCardProps) {
  const { stats } = team;
  const goalDiff = stats.goalsFor - stats.goalsAgainst;

  return (
    <button
      onClick={onClick}
      className={`team-card ${isSelected ? "selected" : ""}`}
      style={{
        borderLeft: `4px solid ${team.secondaryColor !== "#FFFFFF" ? team.secondaryColor : team.primaryColor !== "#FFFFFF" ? team.primaryColor : "#6CABDD"}`,
      }}
    >
      <div className="team-card-header">
        <span className="team-logo">{team.logo}</span>
        <div className="team-info">
          <span className="team-name">{team.name}</span>
          <span className="team-league">
            {team.league} · {team.country}
          </span>
        </div>
        <span className="team-points">{stats.points} pts</span>
      </div>
      <div className="team-card-stats">
        <span className="stat">
          <span className="stat-label">W</span>
          <span className="stat-value won">{stats.won}</span>
        </span>
        <span className="stat">
          <span className="stat-label">D</span>
          <span className="stat-value drawn">{stats.drawn}</span>
        </span>
        <span className="stat">
          <span className="stat-label">L</span>
          <span className="stat-value lost">{stats.lost}</span>
        </span>
        <span className="stat">
          <span className="stat-label">GD</span>
          <span className={`stat-value ${goalDiff > 0 ? "won" : goalDiff < 0 ? "lost" : ""}`}>
            {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
          </span>
        </span>
      </div>
    </button>
  );
}
