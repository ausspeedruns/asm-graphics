#!/usr/bin/env zx

import { fileURLToPath } from "node:url";
import { $, cd, fs, path, spinner, usePowerShell } from "zx";

async function runStep(name: string, action: () => Promise<void>): Promise<void> {
	if (process.env.CI) {
		console.log(`[post-clone] ${name}...`);
	}
	try {
		await spinner(`[post-clone] ${name}`, action);
		console.log(`[post-clone] ${name} complete.`);
	} catch (error) {
		console.error(`[post-clone] ${name} failed.`);
		throw error;
	}
}

if (process.platform === "win32") {
	usePowerShell();
}

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
cd(projectRoot);
console.log(`[post-clone] Setting up project at ${projectRoot}`);

await fs.ensureDir("bundles");
const speedcontrolPath = path.join(projectRoot, "bundles", "nodecg-speedcontrol");
await runStep("Clone nodecg-speedcontrol", async () => {
	if (await fs.pathExists(speedcontrolPath)) {
		console.log("[post-clone] Bundle directory already exists; skipping clone.");
		return;
	}
	await $`git clone https://github.com/speedcontrol/nodecg-speedcontrol.git ${speedcontrolPath}`;
});

await runStep("Install project dependencies", async () => {
	await $`pnpm install`;
});

await runStep("Build nodecg-speedcontrol", async () => {
	cd(speedcontrolPath);
	await $`pnpm build`;
});

await runStep("Build asm-graphics", async () => {
	cd(projectRoot);
	await $`pnpm build`;
});

await runStep("Prepare config files", async () => {
	await fs.ensureDir("cfg");
	const configFiles = [
		["asm-graphics.example.json", "cfg/asm-graphics.json"],
		["nodecg-speedcontrol.example.json", "cfg/nodecg-speedcontrol.json"],
	] as const;

	for (const [examplePath, configPath] of configFiles) {
		if (await fs.pathExists(configPath)) {
			console.log(`[post-clone] ${configPath} already exists; leaving it unchanged.`);
			continue;
		}
		await fs.copy(examplePath, configPath);
		console.log(`[post-clone] Created ${configPath}.`);
	}
});

console.log("[post-clone] Setup complete.");
