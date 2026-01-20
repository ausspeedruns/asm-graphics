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
	colourSourceSchema,
} from "./obs-scene-generator/obs-schemas";
import {
	baseOBSScenesFile,
	baseSource,
	convertSourceToSceneItem,
	generateBrowserSource,
	generateColourSource,
	generateOBSScene,
	generateTextLabelSource,
	type SourceInput,
} from "./obs-scene-generator/generate-sources";
import { GameplayLocations } from "../../shared/obs-gameplay-scene-data";

function generateReferenceColourSource(name: string): z.infer<typeof colourSourceSchema> {
	return generateColourSource(name, "#00ff00ff");
}

function generateTransitionBrowserSource(urlBase: string): z.infer<typeof browserSourceSchema> {
	return generateBrowserSource("Transition Overlay", `${urlBase}/bundles/asm-graphics/graphics/transition.html`, {
		width: 1920,
		height: 1080,
		fps: 60,
	});
}

function generateGameplayBrowserSource(layoutName: string, urlBase: string): z.infer<typeof browserSourceSchema> {
	const browserSource = generateBrowserSource(
		`GAMEPLAY - ${layoutName}`,
		`${urlBase}/bundles/asm-graphics/graphics/gameplay-overlay.html#/${layoutName}`,
		{ width: 1920, height: 1080, fps: 60 },
	);

	// Add the audio monitor filter
	browserSource.filters = [
		{
			prev_ver: 536870916,
			name: "Audio Monitor",
			uuid: "1eea1f8c-515c-47c4-ace0-72208f3e7c94",
			id: "audio_monitor",
			versioned_id: "audio_monitor",
			settings: {
				device: "",
				deviceName: "",
				custom_color: false,
			},
			mixers: 255,
			sync: 0,
			flags: 0,
			volume: 1.0,
			balance: 0.5,
			enabled: true,
			muted: false,
			"push-to-mute": false,
			"push-to-mute-delay": 0,
			"push-to-talk": false,
			"push-to-talk-delay": 0,
			hotkeys: {},
			deinterlace_mode: 0,
			deinterlace_field_order: 0,
			monitoring_type: 0,
			private_settings: {},
		},
	];

	return browserSource;
}

const x32AudioSource: z.infer<typeof audioCaptureSourceSchema> = {
	...baseSource,
	name: "X32 Audio Capture",
	id: "wasapi_input_capture",
	versioned_id: "wasapi_input_capture",
	settings: {
		device_id: "X32 USB Audio",
	},
	mixers: 3,
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
		volume: 0,
		muted: true,
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
		const sceneItem = convertSourceToSceneItem(
			source,
			{
				x: (index % columns) * sourceWidth,
				y: Math.floor(index / columns) * sourceHeight,
				scaleX: sourceWidth / 1920,
				scaleY: sourceHeight / 1080,
			},
			{
				bounds_type: 2,
				bounds: {
					x: sourceWidth,
					y: sourceHeight,
				},
				bounds_rel: {
					x: 1920 / 1080,
					y: 1080 / 1080,
				},
			},
		);

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

const FullCamNames = ["fullcam", "full cam", "full-cam", "full", "fullscreen", "full screen"];

function convertGameplayLayoutNameToGraphicURLName(layoutName: string): string | undefined {
	if (FullCamNames.includes(layoutName.toLowerCase())) {
		return undefined;
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
	const convertedLayoutNames = Array.from(
		new Set(
			options.gameplayLayouts
				.map((layoutName) => convertGameplayLayoutNameToGraphicURLName(layoutName))
				.filter((name) => !!name),
		),
	) as string[];

	// Make all sources
	const transitionBrowserSource = generateTransitionBrowserSource(options.urlBase);

	const fullcamBrowserSource = generateGameplayBrowserSource("None", options.urlBase);
	fullcamBrowserSource.name = "Fullcam Overlay";

	const gameplaySources = [];
	for (let i = 0; i < options.numberOfGameplayCaptures; i++) {
		gameplaySources.push(generateVideoCaptureSource(`Gameplay Capture ${i + 1}`));
	}

	const cameraSources = [];
	for (let i = 0; i < options.numberOfCameraCaptures; i++) {
		cameraSources.push(generateVideoCaptureSource(`Camera Capture ${i + 1}`));
	}

	const allGameplayBrowserSources: Record<string, z.infer<typeof browserSourceSchema>> = {};
	for (const layoutName of convertedLayoutNames) {
		allGameplayBrowserSources[layoutName] = generateGameplayBrowserSource(layoutName, options.urlBase);
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
		fullcamBrowserSource,
		intermissionBrowserSource,
		x32AudioSource,
	];

	// Make all scenes
	const audioScene = generateOBSScene("X32 Audio Capture", [x32AudioSource]);

	const gameplayCaptureScenes = gameplaySources.map((source) => generateOBSScene(source.name, [source]));

	const facecamScene = generateOBSScene("Facecam Capture", [cameraSources[0]]);
	const crowdcamScene = generateOBSScene("Crowdcam Capture", [cameraSources[1] ?? cameraSources[0]]);

	console.log(convertedLayoutNames);
	const gameplayScenes = convertedLayoutNames.map((layoutName) => {
		const gameplayBrowserSource = allGameplayBrowserSources[layoutName];

		if (!gameplayBrowserSource) {
			throw new Error(`No gameplay browser source found for layout: ${layoutName}`);
		}

		// Generate reference colour sources for game crop feature
		const colourReferenceSources: z.infer<typeof sourceSchema>[] = [];
		const colourReferenceSceneItems: SourceInput[] = [];
		const videoLocations = GameplayLocations[layoutName.replaceAll(" ", "-") as keyof typeof GameplayLocations];
		if (videoLocations) {
			for (let i = 0; i < videoLocations.length; i++) {
				const location = videoLocations[i];
				if (!location) continue;

				const colourSource = generateReferenceColourSource(
					`REFERENCE - ${layoutName}${videoLocations.length > 1 ? ` - Screen ${i + 1}` : ""}`,
				);

				colourReferenceSources.push(colourSource);

				const scaleX = location.width / 1920;
				const scaleY = location.height / 1080;

				colourReferenceSceneItems.push({
					source: colourSource,
					overrides: {
						locked: true,
						pos: {
							x: location.x,
							y: location.y,
						},
						pos_rel: {
							x: (2 * location.x - 1920) / 1080,
							y: (2 * location.y - 1080) / 1080,
						},
						scale: {
							x: scaleX,
							y: scaleY,
						},
						scale_rel: {
							x: scaleX,
							y: scaleY,
						},
						visible: false,
					},
				});
			}
		} else {
			console.warn(`No gameplay locations found for layout: ${layoutName}`);
		}

		obsRawSources.push(...colourReferenceSources);

		return generateOBSScene(`GAMEPLAY ${layoutName}`, [
			audioScene,
			facecamScene,
			...colourReferenceSceneItems,
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

	const fullcamScene = generateOBSScene("Fullcam", [
		audioScene,
		facecamScene,
		crowdcamScene,
		{ source: fullcamBrowserSource, overrides: { locked: true } },
		{ source: transitionBrowserSource, overrides: { locked: true } },
	]);

	const divider1Scene = generateOBSScene("==============");
	const divider2Scene = generateOBSScene("==============="); // Extra '=' to avoid ID conflicts

	const [multiviewerScene, labelSources] = generateMultiviewerScene([...gameplaySources, ...cameraSources]);

	const obsScenes = [
		...gameplayScenes,
		divider1Scene,
		intermissionScene,
		fullcamScene,
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
