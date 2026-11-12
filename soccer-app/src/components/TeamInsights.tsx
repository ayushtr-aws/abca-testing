import type { TeamStats } from "../data/teams";
import {
  goalDifference,
  performanceLabel,
  performanceLegend,
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
 *
 * The panel is resilient to missing or zero-match statistics: when a team has
 * played no matches it shows honest placeholder copy instead of misleading
 * figures (e.g. "0%" win rate or "NaN" from dividing by zero).
 */
export function TeamInsights({ teamName, stats }: TeamInsightsProps) {
  const hasPlayed = stats.played > 0;

  const goalDiff = goalDifference(stats);
  const winRatePercent = Math.round(winRate(stats) * 100);
  const label = performanceLabel(stats);

  const goalDiffTrend =
    goalDiff > 0 ? "positive" : goalDiff < 0 ? "negative" : "neutral";
  const goalDiffDisplay = goalDiff > 0 ? `+${goalDiff}` : `${goalDiff}`;
  const goalDiffWord =
    goalDiff > 0 ? "Positive" : goalDiff < 0 ? "Negative" : "Even";

  const placeholder = "—";

  return (
    <section className="insights-section" aria-labelledby="insights-heading">
      <h3 id="insights-heading">Team Insights</h3>
      <p className="insights-summary">
        {hasPlayed ? (
          <>
            A quick read on how <strong>{teamName}</strong> are performing this
            season.
          </>
        ) : (
          <>
            <strong>{teamName}</strong> haven&rsquo;t played any matches yet, so
            there are no performance figures to show.
          </>
        )}
      </p>
      <dl className="insights-grid">
        <div
          className={`insight-card ${hasPlayed ? `insight-${goalDiffTrend}` : ""}`}
        >
          <dt className="insight-label">Goal Difference</dt>
          <dd className="insight-value">
            {hasPlayed ? (
              <>
                <span className="insight-figure">{goalDiffDisplay}</span>
                <span className="insight-tag">{goalDiffWord}</span>
              </>
            ) : (
              <span className="insight-figure">{placeholder}</span>
            )}
          </dd>
          <p className="insight-note">
            {hasPlayed
              ? `${stats.goalsFor} scored, ${stats.goalsAgainst} conceded`
              : "No matches played yet"}
          </p>
        </div>

        <div className="insight-card">
          <dt className="insight-label">Win Rate</dt>
          <dd className="insight-value">
            <span className="insight-figure">
              {hasPlayed ? `${winRatePercent}%` : placeholder}
            </span>
          </dd>
          <p className="insight-note">
            {hasPlayed
              ? `${stats.won} wins from ${stats.played} played`
              : "No matches played yet"}
          </p>
        </div>

        <div
          className={`insight-card ${
            hasPlayed ? `insight-rating-${label.toLowerCase()}` : ""
          }`}
        >
          <dt className="insight-label">Performance</dt>
          <dd className="insight-value">
            <span className="insight-figure insight-figure-label">
              {hasPlayed ? label : "Not rated"}
            </span>
          </dd>
          <p className="insight-note">
            {hasPlayed
              ? "Based on the team’s win rate"
              : "Rating available after the first match"}
          </p>
        </div>
      </dl>

      <div className="insights-legend">
        <h4 className="insights-legend-heading" id="insights-legend-heading">
          Performance ratings
        </h4>
        <dl
          className="insights-legend-list"
          aria-labelledby="insights-legend-heading"
        >
          {performanceLegend.map((entry) => (
            <div className="insights-legend-item" key={entry.label}>
              <dt
                className={`insights-legend-term insight-rating-${entry.label.toLowerCase()}`}
              >
                {entry.label}
              </dt>
              <dd className="insights-legend-desc">{entry.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
