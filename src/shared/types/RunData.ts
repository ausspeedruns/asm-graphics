import { z } from "zod";

export const playerSchema = z.object({
	name: z.string(),
	id: z.string(),
	teamID: z.string(),
	country: z.string().optional(),
	pronouns: z.string().optional(),
	social: z.object({
		twitch: z.string().optional()
	}),
	customData: z.record(z.string(), z.unknown())
});

export const teamSchema = z.object({
	name: z.string().optional(),
	id: z.string(),
	players: z.array(playerSchema),
	relayPlayerID: z.string().optional()
});

export const runDataSchema = z.object({
	game: z.string().optional(),
	gameTwitch: z.string().optional(),
	system: z.string().optional(),
	region: z.string().optional(),
	release: z.string().optional(),
	category: z.string().optional(),
	estimate: z.string().optional(),
	estimateS: z.number().optional(),
	setupTime: z.string().optional(),
	setupTimeS: z.number().optional(),
	scheduled: z.string().optional(),
	scheduledS: z.number().optional(),
	teams: z.array(teamSchema),
	customData: z.record(z.string(), z.unknown()),
	id: z.string(),
	externalID: z.string().optional()
});

export const runDataArraySchema = z.array(runDataSchema);

export type RunData = z.infer<typeof runDataSchema>;

export type RunDataTeam = z.infer<typeof teamSchema>;

export type RunDataPlayer = z.infer<typeof playerSchema>;

export type RunDataArray = z.infer<typeof runDataArraySchema>;

export type RunDataActiveRun = RunData | undefined;

export interface RunDataActiveRunSurrounding {
	previous?: string;
	current?: string;
	next?: string;
}
