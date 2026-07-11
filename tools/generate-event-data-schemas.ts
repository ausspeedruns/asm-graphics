import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { eventSchema, creditsSchema, prizesSchema } from "../src/extensions/schemas/event-setup-schemas.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVENT_DATA_SCHEMAS_FOLDER = path.join(__dirname, "../event-data/schemas");
const DRAFT_2020_12 = "https://json-schema.org/draft/2020-12/schema";

type JSONSchemaObject = {
	type?: unknown;
	properties?: Record<string, unknown>;
	[key: string]: unknown;
};

function run() {
	const schemaFolder = createOrGetSchemasFolder();

	console.log(`Generating event data schemas in ${schemaFolder}...`);

	console.log(`Generating event schema...`);
	const eventSchemaPath = `${schemaFolder}/event.json`;
	const generatedEventSchema = addOptionalInstanceSchemaProperty(eventSchema.toJSONSchema());
	fs.writeFileSync(
		eventSchemaPath,
		JSON.stringify(generatedEventSchema, null, 2),
		"utf-8"
	);
	console.log(`Event schema located at ${path.resolve(eventSchemaPath)}`);

	console.log(`Generating credits schema...`);
	const creditsSchemaPath = `${schemaFolder}/credits.json`;
	const generatedCreditsSchema = addOptionalInstanceSchemaProperty(creditsSchema.toJSONSchema());
	fs.writeFileSync(
		creditsSchemaPath,
		JSON.stringify(generatedCreditsSchema, null, 2),
		"utf-8"
	);
	console.log(`Credits schema located at ${path.resolve(creditsSchemaPath)}`);

	console.log(`Generating prizes schema...`);
	const prizesSchemaPath = `${schemaFolder}/prizes.json`;
	const generatedPrizesSchema = addOptionalInstanceSchemaProperty(prizesSchema.toJSONSchema());
	fs.writeFileSync(
		prizesSchemaPath,
		JSON.stringify(generatedPrizesSchema, null, 2),
		"utf-8"
	);
	console.log(`Prizes schema located at ${path.resolve(prizesSchemaPath)}`);
}

function addOptionalInstanceSchemaProperty(schema: unknown): unknown {
	if (!isSchemaObject(schema) || schema.type !== "object") {
		return schema;
	}

	const properties = schema.properties ?? {};

	return {
		...schema,
		$schema: DRAFT_2020_12,
		properties: {
			...properties,
			$schema: { type: "string" },
		},
	};
}

function isSchemaObject(value: unknown): value is JSONSchemaObject {
	return typeof value === "object" && value !== null;
}

function createOrGetSchemasFolder() {
	fs.mkdirSync(EVENT_DATA_SCHEMAS_FOLDER, { recursive: true });
	return EVENT_DATA_SCHEMAS_FOLDER;
}

run();
