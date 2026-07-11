import { z } from "zod";

export const customDataSchema = z.object({
	gameDisplay: z.string().optional(),
	techPlatform: z.string().optional(),
	specialRequirements: z.string().optional(),
	submission: z.string().optional(),
});
