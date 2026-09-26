import { z } from "zod";

export const runCustomDataSchema = z.object({
	gameDisplay: z.string().optional(),
	techPlatform: z.string().optional(),
	specialRequirements: z.string().optional(),
	submission: z.string().optional(),
	layout: z.string().optional(),
});

export const runnerCustomDataSchema = z.object({
	microphone: z.string().optional(),
});
