import type { TeamStats } from "../data/teams";
import {
  goalDifference,
  performanceLabel,
  winRate,
} from "../utils/teamMetrics";

interface TeamInsightsProps {
  teamName: string;
  stats: TeamStats;
}

/**
 * A compact, accessible summary of a team's key performance metrics.
 *
 * Builds on the shared metric helpers (goal difference, win rate and the
 * qualitative performance label) rather than recomputing anything locally.
 * Meaning is conveyed through text as well as colour so the panel does not
 * rely on colour alone.
 */
export function TeamInsights({ teamName, stats }: TeamInsightsProps) {
  const goalDiff = goalDifference(stats);
  const winRatePercent = Math.round(winRate(stats) * 100);
  const label = performanceLabel(stats);

  const goalDiffTrend =
    goalDiff > 0 ? "positive" : goalDiff < 0 ? "negative" : "neutral";
  const goalDiffDisplay = goalDiff > 0 ? `+${goalDiff}` : `${goalDiff}`;
  const goalDiffWord =
    goalDiff > 0 ? "Positive" : goalDiff < 0 ? "Negative" : "Even";

  return (
    <section className="insights-section" aria-labelledby="insights-heading">
      <h3 id="insights-heading">Team Insights</h3>
      <p className="insights-summary">
        A quick read on how <strong>{teamName}</strong> are performing this
        season.
      </p>
      <dl className="insights-grid">
        <div className={`insight-card insight-${goalDiffTrend}`}>
          <dt className="insight-label">Goal Difference</dt>
          <dd className="insight-value">
            <span className="insight-figure">{goalDiffDisplay}</span>
            <span className="insight-tag">{goalDiffWord}</span>
          </dd>
          <p className="insight-note">
            {stats.goalsFor} scored, {stats.goalsAgainst} conceded
          </p>
        </div>

        <div className="insight-card">
          <dt className="insight-label">Win Rate</dt>
          <dd className="insight-value">
            <span className="insight-figure">{winRatePercent}%</span>
          </dd>
          <p className="insight-note">
            {stats.won} wins from {stats.played} played
          </p>
        </div>

        <div className={`insight-card insight-rating-${label.toLowerCase()}`}>
          <dt className="insight-label">Performance</dt>
          <dd className="insight-value">
            <span className="insight-figure insight-figure-label">
              {label}
            </span>
          </dd>
          <p className="insight-note">Based on the team&rsquo;s win rate</p>
        </div>
      </dl>
    </section>
  );
}
