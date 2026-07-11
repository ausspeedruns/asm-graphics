import { z } from "zod";

export const eventSchema = z.object({
	name: z.string(),
});

export const prizesSchema = z.object({
	items: z.array(z.object({
		item: z.string(),
		quantity: z.number().optional(),
		requirement: z.string().min(1, "Requirement is required"),
		requirementSubheading: z.string().optional(),
		subItem: z.string().optional(),
	})),
});

export const creditsSchema = z.object({
	sections: z.array(z.object({
		title: z.string(),
		names: z.array(z.object({
			name: z.string(),
			role: z.string().optional(),
		})),
	})),
});
