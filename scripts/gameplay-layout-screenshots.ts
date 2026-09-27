#!/usr/bin/env node

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer, { type ElementHandle, type Page } from "puppeteer-core";

const defaultUrl = "http://localhost:9090/bundles/asm-graphics/graphics/gameplay-overlay.html";
const defaultOutputDirectory = "artifacts/gameplay-layout-screenshots";
const expectedChromeMajorVersion = 150;
const waitTimeout = 30_000;

interface TesterOptions {
	url: string;
	chromePath: string | undefined;
	outputDirectory: string;
	help: boolean;
}

interface RunInfo {
	id: string;
	game: string;
	index: number;
	count: number;
	layout: string;
}

const layoutAliases = new Map<string, string>([
	["standard-portrait", "standard-vertical"],
	["standard-3:4", "standard-vertical"],
	["nintendo-ds", "ds"],
	["nintendo-ds-2", "ds-2"],
	["nintendo-3ds", "3ds"],
	["nintendo-3ds-2", "3ds-2"],
	["gameboy-advance", "gba"],
	["gameboy-advance-2", "gba-2"],
	["game-boy-advance", "gba"],
	["game-boy-advance-2", "gba-2"],
	["gameboy-color", "gbc"],
	["game-boy-color", "gbc"],
	["1:1", "1x1"],
	["no-graphics", "none"],
]);

export function normalizeLayoutName(layoutName: string): string {
	return layoutName
		.trim()
		.replace(/^layout:\s*/i, "")
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/_/g, "-")
		.replace(/(\d+)p\b/g, "$1")
		.replace(/-+/g, "-");
}

export function resolveLayoutName(layoutName: string, routeNames: readonly string[]): string | undefined {
	const normalizedName = normalizeLayoutName(layoutName);
	const routeKey = layoutAliases.get(normalizedName) ?? normalizedName;
	return routeNames.find((routeName) => normalizeLayoutName(routeName) === routeKey);
}

export function isExpectedChromeVersion(browserVersion: string): boolean {
	return new RegExp(`^(?:Headless)?Chrome/${expectedChromeMajorVersion}(?:\\.|$)`).test(browserVersion);
}

function readOptionValue(argumentsList: string[], index: number, option: string): string {
	const value = argumentsList[index + 1];
	if (!value || value.startsWith("--")) {
		throw new Error(`Expected a value after ${option}.`);
	}
	return value;
}

function parseOptions(argumentsList: string[]): TesterOptions {
	const options: TesterOptions = {
		url: process.env.GAMEPLAY_OVERLAY_URL ?? defaultUrl,
		chromePath: process.env.CHROME_EXECUTABLE_PATH,
		outputDirectory: process.env.GAMEPLAY_SCREENSHOT_DIRECTORY ?? defaultOutputDirectory,
		help: false,
	};

	for (let index = 0; index < argumentsList.length; index += 1) {
		const argument = argumentsList[index];
		if (argument === "--help" || argument === "-h") {
			options.help = true;
		} else if (argument === "--url") {
			options.url = readOptionValue(argumentsList, index, argument);
			index += 1;
		} else if (argument === "--chrome") {
			options.chromePath = readOptionValue(argumentsList, index, argument);
			index += 1;
		} else if (argument === "--output") {
			options.outputDirectory = readOptionValue(argumentsList, index, argument);
			index += 1;
		} else {
			throw new Error(`Unknown argument: ${argument}`);
		}
	}

	return options;
}

function printUsage(): void {
	console.log(`Usage: pnpm test:gameplay-layouts [options]

Options:
  --url <url>       NodeCG gameplay-overlay URL
  --chrome <path>   Chrome 150 executable path
  --output <path>   Screenshot directory
  --help            Show this help

Environment:
  CHROME_EXECUTABLE_PATH, GAMEPLAY_OVERLAY_URL, GAMEPLAY_SCREENSHOT_DIRECTORY`);
}

function safeName(value: string): string {
	return value
		.normalize("NFKD")
		.replace(/[^a-zA-Z0-9_-]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase()
		.slice(0, 60);
}

async function readCurrentRun(page: Page): Promise<RunInfo> {
	return page.evaluate(() => {
		const element = document.querySelector<HTMLSpanElement>("#intended-layout");
		if (!element) {
			throw new Error("The intended layout element was not found.");
		}

		return {
			id: element.dataset.runId ?? "",
			game: element.dataset.runGame ?? "",
			index: Number(element.dataset.runIndex),
			count: Number(element.dataset.runCount),
			layout: element.textContent?.trim() ?? "",
		};
	});
}

async function selectLayout(page: Page, routeName: string): Promise<void> {
	await page.evaluate((name) => {
		window.location.hash = `/${name}`;
	}, routeName);
	await page.waitForFunction((name) => window.location.hash === `#/${name}`, { timeout: waitTimeout }, routeName);
	await page.evaluate(async () => {
		await document.fonts.ready;
		await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
	});
}

async function captureRun(page: Page, run: RunInfo, routeNames: readonly string[], outputDirectory: string): Promise<boolean> {
	const routeName = resolveLayoutName(run.layout, routeNames);
	if (!routeName) {
		console.warn(`[skip] Run ${run.index + 1}/${run.count} (${run.id}): no route for "${run.layout || "<empty>"}"`);
		return false;
	}

	await selectLayout(page, routeName);
	const filename = `${String(run.index + 1).padStart(3, "0")}-${safeName(run.game) || "game"}-${safeName(run.layout) || "unknown"}-${safeName(run.id)}.png`;
	const container = await page.$("#gameplay-container");
	if (!container) {
		throw new Error("The gameplay container was not found.");
	}
	await screenshotWithoutBorder(container, path.join(outputDirectory, filename));
	console.log(`[saved] ${filename} (${routeName})`);
	return true;
}

async function screenshotWithoutBorder(container: ElementHandle, screenshotPath: string): Promise<void> {
	const originalBorder = await container.evaluate((element) => {
		if (!(element instanceof HTMLElement)) {
			throw new Error("The gameplay container is not an HTML element.");
		}
		return {
			rightValue: element.style.getPropertyValue("border-right"),
			rightPriority: element.style.getPropertyPriority("border-right"),
			bottomValue: element.style.getPropertyValue("border-bottom"),
			bottomPriority: element.style.getPropertyPriority("border-bottom"),
		};
	});
	await container.evaluate((element) => {
		if (!(element instanceof HTMLElement)) {
			throw new Error("The gameplay container is not an HTML element.");
		}
		element.style.setProperty("border-right", "none", "important");
		element.style.setProperty("border-bottom", "none", "important");
	});

	try {
		await container.screenshot({ path: screenshotPath, type: "png" });
	} finally {
		await container.evaluate((element, original) => {
			if (!(element instanceof HTMLElement)) {
				throw new Error("The gameplay container is not an HTML element.");
			}
			if (original.rightValue) {
				element.style.setProperty("border-right", original.rightValue, original.rightPriority);
			} else {
				element.style.removeProperty("border-right");
			}
			if (original.bottomValue) {
				element.style.setProperty("border-bottom", original.bottomValue, original.bottomPriority);
			} else {
				element.style.removeProperty("border-bottom");
			}
		}, originalBorder);
	}
}

async function waitForNextRun(page: Page, previousRunId: string): Promise<void> {
	await page.waitForFunction(
		(previousId) => {
			const element = document.querySelector<HTMLSpanElement>("#intended-layout");
			return Boolean(element?.dataset.runId && element.dataset.runId !== previousId);
		},
		{ timeout: waitTimeout },
		previousRunId,
	);
}

async function main(): Promise<void> {
	const options = parseOptions(process.argv.slice(2));
	if (options.help) {
		printUsage();
		return;
	}
	if (!options.chromePath) {
		throw new Error("Set CHROME_EXECUTABLE_PATH to a Chrome for Testing 150 executable, or pass --chrome.");
	}

	const browser = await puppeteer.launch({
		executablePath: options.chromePath,
		headless: true,
		defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
	});

	try {
		const browserVersion = await browser.version();
		if (!isExpectedChromeVersion(browserVersion)) {
			throw new Error(`Expected Chrome ${expectedChromeMajorVersion}, got ${browserVersion}.`);
		}
		console.log(`[browser] ${browserVersion}`);

		const page = await browser.newPage();
		await page.goto(options.url, { waitUntil: "domcontentloaded", timeout: waitTimeout });
		await page.waitForSelector("#event-start", { visible: true, timeout: waitTimeout });
		await page.waitForSelector("#next-run", { visible: true, timeout: waitTimeout });
		await page.waitForSelector("#gameplay-container", { visible: true, timeout: waitTimeout });
		await page.waitForFunction(
			() => document.querySelectorAll<HTMLAnchorElement>('a[href^="#/"]').length > 0,
			{ timeout: waitTimeout },
		);

		const routeNames = await page.evaluate(() =>
			Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#/"]'))
				.map((anchor) => new URL(anchor.href).hash.slice(2))
				.filter(Boolean),
		);
		try {
			await page.waitForFunction(
				() => Boolean(document.querySelector<HTMLSpanElement>("#intended-layout")?.dataset.firstRunId),
				{ timeout: waitTimeout },
			);
		} catch {
			throw new Error("No run data became available; confirm that NodeCG has a non-empty schedule loaded.");
		}
		const firstRunId = await page.evaluate(
			() => document.querySelector<HTMLSpanElement>("#intended-layout")?.dataset.firstRunId ?? "",
		);
		if (!firstRunId) {
			throw new Error("No runs are available in the live NodeCG schedule.");
		}

		await mkdir(options.outputDirectory, { recursive: true });
		await page.click("#event-start");
		await page.waitForFunction(
			(expectedId) => document.querySelector<HTMLSpanElement>("#intended-layout")?.dataset.runId === expectedId,
			{ timeout: waitTimeout },
			firstRunId,
		);

		let run = await readCurrentRun(page);
		let savedCount = 0;
		let skippedCount = 0;
		while (true) {
			if (!run.id || run.index < 0 || run.count < 1) {
				throw new Error("The active run metadata is incomplete; reload the gameplay overlay and try again.");
			}
			if (await captureRun(page, run, routeNames, options.outputDirectory)) {
				savedCount += 1;
			} else {
				skippedCount += 1;
			}

			const nextDisabled = await page.$eval("#next-run", (button) => (button as HTMLButtonElement).disabled);
			if (nextDisabled) break;

			await page.click("#next-run");
			await waitForNextRun(page, run.id);
			const nextRun = await readCurrentRun(page);
			if (nextRun.index !== run.index + 1) {
				throw new Error(`Expected run ${run.index + 2}, but active run index advanced to ${nextRun.index + 1}.`);
			}
			run = nextRun;
		}

		console.log(`[done] ${savedCount} screenshot(s) saved, ${skippedCount} run(s) skipped. Output: ${path.resolve(options.outputDirectory)}`);
	} finally {
		await browser.close();
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	main().catch((error: unknown) => {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`[error] ${message}`);
		process.exitCode = 1;
	});
}