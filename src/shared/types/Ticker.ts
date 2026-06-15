export const TICKER_SEGMENTS = ["cta", "nextruns", "prizes", "incentives", "milestone", "donationMatches"] as const;

export const DEFAULT_TICKER_ORDER: { id: TickerSegment; enabled: boolean; settings?: Record<string, unknown> }[] = [
	{ id: "cta", enabled: true },
	{ id: "nextruns", enabled: true },
	{ id: "prizes", enabled: true },
	{ id: "incentives", enabled: true },
	{ id: "milestone", enabled: true },
	{ id: "donationMatches", enabled: true },
];

export type TickerSegment = typeof TICKER_SEGMENTS[number];
