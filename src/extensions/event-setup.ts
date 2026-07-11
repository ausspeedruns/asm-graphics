import * as nodecgApiContext from "./nodecg-api-context.js";

import AdmZip from "adm-zip";
import { getReplicant } from "./replicants.js";
import { runDataArraySchema, type RunDataArray } from "../shared/types/RunData.js";
import { creditsSchema, eventSchema, prizesSchema } from "./schemas/event-setup-schemas.js";
import type z from "zod";
import type { Prize } from "./prizes.js";
import path from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import type { IncomingMessage } from "node:http";

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("event-setup");

const SPEEDCONTROL_runDataArray = nodecg.Replicant<RunDataArray>("runDataArray", "nodecg-speedcontrol");

const creditsRep = getReplicant("credits");
const prizesRep = getReplicant("prizes");
const router = nodecg.Router();

const ASSET_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../assets", nodecg.bundleName);
const EVENT_UPLOAD_ROUTE = `/bundles/${nodecg.bundleName}/event-upload`;

router.post(EVENT_UPLOAD_ROUTE, nodecg.util.authCheck, async (req, res) => {
	try {
		log.info("Receiving uploaded event ZIP");
		const zipBuffer = await readRequestBuffer(req);
		log.info(`Read uploaded event ZIP (${zipBuffer.length} bytes)`);

		if (zipBuffer.length === 0) {
			log.warn("Received empty event ZIP upload");
			res.status(400).send("No ZIP file uploaded");
			return;
		}

		unpackZip(zipBuffer);
		log.info("Processed uploaded event ZIP");
		res.status(204).end();
	} catch (error) {
		log.error("Failed to process uploaded event ZIP:", error);
		res.status(500).send("Failed to process event ZIP");
	}
});

nodecg.mount(router);

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

function unpackZip(zipBuffer: Buffer) {
	const zip = new AdmZip(zipBuffer);
	const entries = zip.getEntries();
	const rootPrefix = detectZipRootPrefix(entries);

	log.info(`Unpacking event ZIP with ${entries.length} entries`);
	log.info(`Event ZIP entries: ${entries.map((entry) => entry.entryName).join(", ")}`);
	if (rootPrefix) {
		log.info(`Detected ZIP root folder: ${rootPrefix}`);
	}

	// Extract general event info
	const eventFile = readZipText(zip, "event.json", rootPrefix);
	let eventData: z.infer<typeof eventSchema> = {
		name: "Event Name",
	};

	if (eventFile) {
		eventData = event(eventFile) ?? eventData;
	} else {
		log.warn("event.json not found in uploaded ZIP; using default event name");
	}

	// Extract sponsor images
	const sponsorAssetCount = handleAssetFiles(zip, "sponsors", "sponsors", rootPrefix);
	log.info(`Extracted ${sponsorAssetCount} sponsor asset${sponsorAssetCount === 1 ? "" : "s"}`);

	// Extract sponsor videos
	const videoAssetCount = handleAssetFiles(zip, "videos", "intermissionVideos", rootPrefix);
	log.info(`Extracted ${videoAssetCount} video asset${videoAssetCount === 1 ? "" : "s"}`);

	// Extract prizes json
	const prizesFile = readZipText(zip, "prizes.json", rootPrefix);
	if (prizesFile) {
		prizes(prizesFile);
	} else {
		log.warn("prizes.json not found in uploaded ZIP");
	}

	// Extract logo
	const logoEntry = resolveZipEntry(zip, "logo.png", rootPrefix);
	if (logoEntry && !logoEntry.isDirectory) {
		placeFileInAssets(logoEntry.getData(), "logo.png", "logo");
		log.info("Extracted event logo");
	} else {
		log.warn("logo.png not found in uploaded ZIP");
	}

	// Extract credits json
	const creditsFile = readZipText(zip, "credits.json", rootPrefix);
	if (creditsFile) {
		credits(creditsFile, eventData.name, logoEntry ? getAssetUrl("logo", "logo.png") : "");
	} else {
		log.warn("credits.json not found in uploaded ZIP");
	}

	// Extract runs json
	const runsFile = readZipText(zip, "runs.json", rootPrefix);
	if (runsFile) {
		runs(runsFile);
	} else {
		log.warn("runs.json not found in uploaded ZIP");
	}

	log.info(`Finished processing event ZIP for event \"${eventData.name}\"`);
}

function normalizeZipPath(entryName: string) {
	let normalized = entryName.replaceAll("\\", "/");

	while (normalized.startsWith("./")) {
		normalized = normalized.slice(2);
	}

	return normalized.replace(/^\/+/, "");
}

function detectZipRootPrefix(entries: AdmZip.IZipEntry[]) {
	const filePaths = entries
		.filter((entry) => !entry.isDirectory)
		.map((entry) => normalizeZipPath(entry.entryName));

	if (filePaths.length === 0) {
		return "";
	}

	const firstSegments = new Set(filePaths.map((entryPath) => entryPath.split("/")[0]));
	if (firstSegments.size !== 1) {
		return "";
	}

	const [segment] = [...firstSegments];
	if (filePaths.every((entryPath) => entryPath.startsWith(`${segment}/`))) {
		return `${segment}/`;
	}

	return "";
}

function resolveZipEntry(zip: AdmZip, relativePath: string, rootPrefix = "") {
	const normalizedPath = normalizeZipPath(relativePath);
	const directEntry = zip.getEntry(normalizedPath);
	if (directEntry) {
		return directEntry;
	}

	if (!rootPrefix) {
		return undefined;
	}

	return zip.getEntry(normalizeZipPath(`${rootPrefix}${normalizedPath}`));
}

function readZipText(zip: AdmZip, relativePath: string, rootPrefix = "") {
	const entry = resolveZipEntry(zip, relativePath, rootPrefix);
	if (!entry || entry.isDirectory) {
		return undefined;
	}

	return entry.getData().toString("utf8");
}

function readRequestBuffer(req: IncomingMessage) {
	return new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];

		req.on("data", (chunk: Buffer | string) => {
			chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
		});
		req.on("end", () => {
			resolve(Buffer.concat(chunks));
		});
		req.on("error", reject);
	});
}

function placeFileInAssets(file: Buffer, fileName: string, asset: string) {
	const sanitizedFileName = path.basename(fileName);
	const assetsFolder = path.join(ASSET_ROOT, asset);
	const filePath = path.join(assetsFolder, sanitizedFileName);

	mkdirSync(assetsFolder, { recursive: true });
	writeFileSync(filePath, file);
	log.debug(`Wrote asset file ${sanitizedFileName} to ${asset}`);
}

function getAssetUrl(asset: string, fileName: string) {
	return `/assets/${nodecg.bundleName}/${asset}/${encodeURIComponent(path.basename(fileName))}`;
}

function handleAssetFiles(zip: AdmZip, folder: string, asset: string, rootPrefix = "") {
	let extractedCount = 0;
	const normalizedFolder = normalizeZipPath(folder);
	const folderPrefix = `${normalizedFolder}/`;
	const normalizedRootPrefix = normalizeZipPath(rootPrefix);

	zip.getEntries().forEach((entry) => {
		if (entry.isDirectory) {
			return;
		}

		let entryPath = normalizeZipPath(entry.entryName);
		if (normalizedRootPrefix && entryPath.startsWith(`${normalizedRootPrefix}/`)) {
			entryPath = entryPath.slice(normalizedRootPrefix.length + 1);
		}

		if (!entryPath.startsWith(folderPrefix)) {
			return;
		}

		const fileName = path.posix.basename(entryPath);
		const fileBuffer = entry.getData();
		placeFileInAssets(fileBuffer, fileName, asset);
		extractedCount += 1;
	});

	if (extractedCount === 0) {
		log.warn(`No files found in ${folder}/ within uploaded ZIP`);
	}

	return extractedCount;
}

function event(file: string) {
	const event = eventSchema.safeParse(JSON.parse(file));
	if (!event.success) {
		log.error("Failed to parse event.json:", event.error);
		return;
	}

	log.info(`Parsed event metadata for \"${event.data.name}\"`);

	return event.data;
}

function prizes(file: string) {
	const prizes = prizesSchema.safeParse(JSON.parse(file));
	if (!prizes.success) {
		log.error("Failed to parse prizes.json:", prizes.error);
		return;
	}

	const compiledPrizes = prizes.data.items.map((jsonPrize) => {
		const prize: Prize = {
			id: crypto.randomUUID(),
			item: jsonPrize.item,
			quantity: jsonPrize.quantity,
			requirement: jsonPrize.requirement,
			requirementSubheading: jsonPrize.requirementSubheading,
			subItem: jsonPrize.subItem,
		};

		return prize;
	});

	prizesRep.value = compiledPrizes;
	log.info(`Updated prizes replicant with ${compiledPrizes.length} item${compiledPrizes.length === 1 ? "" : "s"}`);
}

function credits(file: string, eventName: string, logoUrl: string) {
	const credits = creditsSchema.safeParse(JSON.parse(file));
	if (!credits.success) {
		log.error("Failed to parse credits.json:", credits.error);
		return;
	}

	creditsRep.value = {
		logo: logoUrl,
		eventName: eventName,
		sections: credits.data.sections,
	};
	log.info(`Updated credits replicant with ${credits.data.sections.length} section${credits.data.sections.length === 1 ? "" : "s"}`);
}

function runs(file: string) {
	const runs = runDataArraySchema.safeParse(JSON.parse(file));

	if (!runs.success) {
		log.error("Failed to parse runs.json:", runs.error);
		return;
	}

	SPEEDCONTROL_runDataArray.value = runs.data;
	log.info(`Updated speedcontrol runDataArray with ${runs.data.length} run${runs.data.length === 1 ? "" : "s"}`);
}
