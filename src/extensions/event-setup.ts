import * as nodecgApiContext from "./nodecg-api-context.js";

import AdmZip from "adm-zip";
import { getReplicant } from "./replicants.js";
import type NodeCG from "nodecg/types";
import { runDataArraySchema, runDataSchema, type RunDataArray } from "@asm-graphics/types/RunData.js";
import { creditsSchema, eventSchema, prizesSchema } from "./schemas/event-setup-schemas.js";
import type z from "zod";
import type { Prize } from "./prizes.js";
import path from "path";
import { writeFileSync } from "fs";

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("event-setup");

const sponsorImagesRep = nodecg.Replicant<NodeCG.default.AssetFile[]>("assets:sponsors", "asm-graphics");
const intermissionVideosRep = nodecg.Replicant<NodeCG.default.AssetFile[]>("assets:intermissionVideos", "asm-graphics");
const logoRep = nodecg.Replicant<NodeCG.default.AssetFile[]>("assets:logo", "asm-graphics");

const SPEEDCONTROL_runDataArray = nodecg.Replicant<RunDataArray>("runDataArray", "nodecg-speedcontrol");

const creditsRep = getReplicant("credits");
const prizesRep = getReplicant("prizes");

// Some kind of end point to get the zip file uploaded (might just do an asset)

const ASSET_FOLDER = "../"

/*

Folder Structure:
	.
	├── event.json
	├── prizes.json
	├── credits.json
	├── runs.json
	├── logo.png
	├── videos/
	│   └── exampleVideo.mp4
	└── sponsors/
		└── sponsor-image.png

*/

function unpackZip() {
	const zip = new AdmZip("path/to/zipfile.zip");

	// Extract general event info
	const eventFile = zip.readAsText("event.json");
	let eventData: z.infer<typeof eventSchema> = {
		name: "Event Name",
	}

	if (eventFile) {
		eventData = event(eventFile) ?? eventData;
	}

	// Extract sponsor images
	handleAssetFiles(zip, "sponsors", "sponsors");

	// Extract sponsor videos
	handleAssetFiles(zip, "videos", "intermissionVideos");

	// Extract prizes json
	const prizesFile = zip.readAsText("prizes.json");
	if (prizesFile) {
		prizes(prizesFile);
	}

	// Extract logo
	const logoFile = zip.readAsText("logo.png");
	if (logoFile) {
		placeFileInAssets(Buffer.from(logoFile, "base64"), "logo.png", "logo");
	}

	// Extract credits json
	const creditsFile = zip.readAsText("credits.json");
	if (creditsFile) {
		credits(creditsFile, eventData.name);
	}

	// Extract runs json
	const runsFile = zip.readAsText("runs.json");
	if (runsFile) {
		runs(runsFile);
	}
}

function placeFileInAssets(file: Buffer, fileName: string, asset: string) {
	const assetsFolder = path.join(__dirname, ASSET_FOLDER, asset);
	const filePath = path.join(assetsFolder, fileName);

	writeFileSync(filePath, file);
}

function handleAssetFiles(zip: AdmZip, folder: string, asset: string) {
	zip.getEntries().forEach((entry) => {
		if (!entry.entryName.startsWith(`${folder}/`) || entry.isDirectory) {
			return;
		}

		const fileName = entry.name;
		const fileBuffer = entry.getData();
		placeFileInAssets(fileBuffer, fileName, asset);
	});
}

function event(file: string) {
	const event = eventSchema.safeParse(JSON.parse(file));
	if (!event.success) {
		log.error("Failed to parse event.json:", event.error);
		return;
	}

	return event.data;
}

function prizes(file: string) {
	const prizes = prizesSchema.safeParse(JSON.parse(file));
	if (!prizes.success) {
		log.error("Failed to parse prizes.json:", prizes.error);
		return;
	}

	const compiledPrizes = prizes.data.map((jsonPrize) => {
		const prize: Prize = {
			id: crypto.randomUUID(),
			item: jsonPrize.item,
			quantity: jsonPrize.quantity,
			requirement: jsonPrize.requirement,
			requirementSubheading: jsonPrize.requirementSubheading,
			subItem: jsonPrize.subItem,
		}

		return prize;
	});

	prizesRep.value = compiledPrizes;
}

function credits(file: string, eventName: string) {
	const credits = creditsSchema.safeParse(JSON.parse(file));
	if (!credits.success) {
		log.error("Failed to parse credits.json:", credits.error);
		return;
	}

	creditsRep.value = {
		logo: logoRep.value?.[0]?.url ?? "",
		eventName: eventName,
		sections: credits.data,
	}
}

function runs(file: string) {
	const runs = runDataArraySchema.safeParse(JSON.parse(file));

	if (!runs.success) {
		log.error("Failed to parse runs.json:", runs.error);
		return;
	}

	SPEEDCONTROL_runDataArray.value = runs.data;
}
