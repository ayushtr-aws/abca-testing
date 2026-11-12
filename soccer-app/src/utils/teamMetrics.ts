import type { TeamStats } from "../data/teams";

/**
 * Concise qualitative label describing a team's performance based on its win rate.
 */
export type PerformanceLabel = "Elite" | "Strong" | "Average" | "Struggling";

/**
 * Goal difference: goals scored minus goals conceded.
 *
 * @param stats - The team's aggregate statistics.
 * @returns The signed goal difference (positive, negative, or zero).
 */
export function goalDifference(stats: TeamStats): number {
  return stats.goalsFor - stats.goalsAgainst;
}

/**
 * Win rate as a fraction of matches played, in the range [0, 1].
 *
 * Returns 0 when no matches have been played to avoid division by zero.
 *
 * @param stats - The team's aggregate statistics.
 * @returns The win rate rounded to four decimal places for deterministic output.
 */
export function winRate(stats: TeamStats): number {
  if (stats.played <= 0) {
    return 0;
  }

  const rate = stats.won / stats.played;
  // Round to 4 decimals to keep the output deterministic and stable.
  return Math.round(rate * 10000) / 10000;
}

/**
 * A concise performance label derived from a team's win rate.
 *
 * Thresholds (on win rate):
 * - `>= 0.7` -> "Elite"
 * - `>= 0.5` -> "Strong"
 * - `>= 0.3` -> "Average"
 * - otherwise -> "Struggling"
 *
 * Teams with no matches played are labelled "Average" as a neutral default.
 *
 * @param stats - The team's aggregate statistics.
 * @returns A concise performance label.
 */
export function performanceLabel(stats: TeamStats): PerformanceLabel {
  if (stats.played <= 0) {
    return "Average";
  }

  const rate = winRate(stats);

  if (rate >= 0.7) {
    return "Elite";
  }
  if (rate >= 0.5) {
    return "Strong";
  }
  if (rate >= 0.3) {
    return "Average";
  }
  return "Struggling";
}

/**
 * A single entry in the performance-label legend.
 */
export interface PerformanceLegendEntry {
  /** The qualitative label. */
  label: PerformanceLabel;
  /** Human-readable description of the win-rate band the label covers. */
  description: string;
}

/**
 * Legend describing the win-rate bands behind each performance label.
 *
 * Kept alongside {@link performanceLabel} so the copy shown to users stays in
 * sync with the thresholds used to compute the label. Ordered from strongest
 * to weakest.
 */
export const performanceLegend: readonly PerformanceLegendEntry[] = [
  { label: "Elite", description: "Win rate 70% or higher" },
  { label: "Strong", description: "Win rate 50–69%" },
  { label: "Average", description: "Win rate 30–49%" },
  { label: "Struggling", description: "Win rate below 30%" },
];
