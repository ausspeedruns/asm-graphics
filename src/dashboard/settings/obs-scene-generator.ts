import type z from "zod";
import type {
	sourceSchema,
	browserSourceSchema,
	audioCaptureSourceSchema,
	videoCaptureSourceSchema,
	sceneSourceSchema,
	textSourceSchema,
	obsSceneFileSchema,
	sourceItems,
} from "./obs-scene-generator/obs-schemas";
import {
	baseOBSScenesFile,
	baseSource,
	convertSourceToSceneItem,
	generateBrowserSource,
	generateColourSource,
	generateOBSScene,
	generateTextLabelSource,
} from "./obs-scene-generator/generate-sources";

function generateTransitionBrowserSource(urlBase: string): z.infer<typeof browserSourceSchema> {
	return generateBrowserSource("Transition Overlay", `${urlBase}/bundles/asm-graphics/graphics/transition.html`, {
		width: 1920,
		height: 1080,
		fps: 60,
	});
}

function generateGameplayBrowserSource(layoutName: string, urlBase: string): z.infer<typeof browserSourceSchema> {
	return generateBrowserSource(
		`GAMEPLAY - ${layoutName}`,
		`${urlBase}/bundles/asm-graphics/graphics/gameplay-overlay.html#/${layoutName}`,
		{ width: 1920, height: 1080, fps: 60 },
	);
}

const x32AudioSource: z.infer<typeof audioCaptureSourceSchema> = {
	...baseSource,
	name: "X32 Audio Capture",
	id: "wasapi_input_capture",
	versioned_id: "wasapi_input_capture",
	settings: {
		device_id: "X32 USB Audio",
	},
};

function generateVideoCaptureSource(name: string): z.infer<typeof videoCaptureSourceSchema> {
	return {
		...baseSource,
		name,
		id: "dshow_input",
		versioned_id: "dshow_input",
		settings: {
			video_device_id: "",
			last_video_device_id: "",
		},
	};
}

interface Layout {
	columns: number;
	rows: number;
}

function getOptimalLayout(videoCount: number): Layout {
	if (videoCount <= 0) return { columns: 0, rows: 0 };

	let bestLayout: Layout = { columns: videoCount, rows: 1 };
	let minEmptySlots = Infinity;

	// We loop through possible column counts to find the best fit
	for (let cols = 1; cols <= videoCount; cols++) {
		const rows = Math.ceil(videoCount / cols);
		const totalSlots = cols * rows;
		const emptySlots = totalSlots - videoCount;

		// We prefer layouts that are "wider" than they are "tall" to match
		// the 16:9 orientation, and we want to minimise wasted space.
		if (emptySlots <= minEmptySlots) {
			// If empty slots are equal, we prefer a balance where cols >= rows
			if (emptySlots < minEmptySlots || cols >= rows) {
				// Specifically for 16:9, we want to avoid tall/skinny grids
				// A simple check: the ratio of cols/rows should be >= 1 whenever possible
				if (cols / rows >= 1 || cols === videoCount) {
					bestLayout = { columns: cols, rows };
					minEmptySlots = emptySlots;
				}
			}
		}

		// Break early if we find a perfect square that is larger than the count
		if (cols * cols >= videoCount && cols === rows && emptySlots === 0) {
			return { columns: cols, rows };
		}
	}

	return bestLayout;
}

function generateMultiviewerScene(
	videoSources: z.infer<typeof videoCaptureSourceSchema>[],
): [z.infer<typeof sceneSourceSchema>, z.infer<typeof textSourceSchema>[]] {
	// Calculate layout based on number of video sources
	const numOfSources = videoSources.length;
	const { columns, rows } = getOptimalLayout(numOfSources);

	const sourceWidth = 1920 / columns;
	const sourceHeight = 1080 / rows;

	const videoSceneItems = videoSources.map((source, index) => {
		const sceneItem = convertSourceToSceneItem(source, {
			x: (index % columns) * sourceWidth,
			y: Math.floor(index / columns) * sourceHeight,
			scaleX: sourceWidth / 1920,
			scaleY: sourceHeight / 1080,
		});

		return sceneItem;
	});

	// Generate text labels for each video source
	const labelSources = videoSources.map((source) => {
		return generateTextLabelSource(source.name);
	});

	const labelSceneItems = labelSources.map((source, index) => {
		const sceneItem = convertSourceToSceneItem(source, {
			x: (index % columns) * sourceWidth + 10, // 10px padding from left
			y: Math.floor(index / columns) * sourceHeight + 10, // 10px padding from top
			scaleX: 1.0,
			scaleY: 1.0,
		});
		return sceneItem;
	});

	return [generateOBSScene("Multiviewer", [], [...videoSceneItems, ...labelSceneItems]), labelSources];
}

function convertGameplayLayoutNameToGraphicURLName(layoutName: string): string {
	if (layoutName.toLowerCase() === "fullcam") {
		return "None";
	}

	return layoutName
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/(\d+)p/gi, "$1"); // Convert '2p' to '2', '4p' to '4', etc.
}

export function generateOBSScenes(options: {
	name: string;
	gameplayLayouts: string[];
	asnn?: boolean;
	urlBase: string;
	numberOfGameplayCaptures: number; // Normally 2 (Up to 2 runners)
	numberOfCameraCaptures: number; // Normally 2 (Runner and Crowd cam)
}) {
	// Make all sources
	const transitionBrowserSource = generateTransitionBrowserSource(options.urlBase);

	const gameplaySources = [];
	for (let i = 0; i < options.numberOfGameplayCaptures; i++) {
		gameplaySources.push(generateVideoCaptureSource(`Gameplay Capture ${i + 1}`));
	}

	const cameraSources = [];
	for (let i = 0; i < options.numberOfCameraCaptures; i++) {
		cameraSources.push(generateVideoCaptureSource(`Camera Capture ${i + 1}`));
	}

	const allGameplayBrowserSources: Record<string, z.infer<typeof browserSourceSchema>> = {};
	for (const layoutName of options.gameplayLayouts) {
		allGameplayBrowserSources[layoutName] = generateGameplayBrowserSource(
			convertGameplayLayoutNameToGraphicURLName(layoutName),
			options.urlBase,
		);
	}

	const intermissionBrowserSource = generateBrowserSource(
		"Intermission Browser Source",
		`${options.urlBase}/bundles/asm-graphics/graphics/intermission.html`,
		{ width: 1920, height: 1080, fps: 60 },
	);

	const obsRawSources: z.infer<typeof sourceSchema>[] = [
		transitionBrowserSource,
		...gameplaySources,
		...cameraSources,
		...Object.values(allGameplayBrowserSources),
		intermissionBrowserSource,
		x32AudioSource,
	];

	// Make all scenes
	const audioScene = generateOBSScene("X32 Audio Capture", [x32AudioSource]);

	const gameplayCaptureScenes = gameplaySources.map((source) =>
		generateOBSScene(source.name, [source]),
	);

	const facecamScene = generateOBSScene("Facecam Capture", [cameraSources[0]]);
	const crowdcamScene = generateOBSScene("Crowdcam Capture", [cameraSources[1] ?? cameraSources[0]]);

	const gameplayScenes = options.gameplayLayouts.map((layoutName) => {
		const gameplayBrowserSource = allGameplayBrowserSources[layoutName];

		if (!gameplayBrowserSource) {
			throw new Error(`No gameplay browser source found for layout: ${layoutName}`);
		}

		return generateOBSScene(`GAMEPLAY ${layoutName}`, [
			audioScene,
			facecamScene,
			...gameplayCaptureScenes,
			{ source: gameplayBrowserSource, overrides: { locked: true } },
			{ source: transitionBrowserSource, overrides: { locked: true } },
		]);
	});

	// TODO: ASNN

	const intermissionScene = generateOBSScene("Intermission", [
		audioScene,
		crowdcamScene,
		{ source: intermissionBrowserSource, overrides: { locked: true } },
		{ source: transitionBrowserSource, overrides: { locked: true } },
	]);

	const divider1Scene = generateOBSScene("==============");
	const divider2Scene = generateOBSScene("==============="); // Extra '=' to avoid ID conflicts

	const [multiviewerScene, labelSources] = generateMultiviewerScene([...gameplaySources, ...cameraSources]);

	const obsScenes = [
		...gameplayScenes,
		divider1Scene,
		intermissionScene,
		// ASNN scenes would go here
		divider2Scene,
		...gameplayCaptureScenes,
		facecamScene,
		crowdcamScene,
		audioScene,
		multiviewerScene,
	];

	obsRawSources.push(...labelSources);

	// Make the final OBS scenes file object
	const obsSceneFile: z.infer<typeof obsSceneFileSchema> = {
		...baseOBSScenesFile,
		name: options.name,
		scene_order: obsScenes.map((scene) => ({ name: scene.name })),
		sources: [...obsScenes, ...obsRawSources] as z.infer<(typeof sourceItems)[number]>[],
	};

	return obsSceneFile;
}
