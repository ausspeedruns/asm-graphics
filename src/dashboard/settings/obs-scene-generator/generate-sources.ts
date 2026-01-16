import type z from "zod";
import type {
	sceneItemSchema,
	sourceSchema,
	obsSceneFileSchema,
	browserSourceSchema,
	sceneSourceSchema,
	textSourceSchema,
	colourSourceSchema,
} from "./obs-schemas";

export const baseSceneItem: z.infer<typeof sceneItemSchema> = {
	name: "",
	source_uuid: "",
	visible: true,
	locked: false,
	rot: 0.0,
	scale_ref: {
		x: 1920.0,
		y: 1080.0,
	},
	align: 5,
	bounds_type: 0,
	bounds_align: 0,
	bounds_crop: false,
	crop_left: 0,
	crop_top: 0,
	crop_right: 0,
	crop_bottom: 0,
	id: 1,
	group_item_backup: false,
	pos: {
		x: 0.0,
		y: 0.0,
	},
	pos_rel: {
		x: -1920 / 1080,
		y: -1,
	},
	scale: {
		x: 1.0,
		y: 1.0,
	},
	scale_rel: {
		x: 1.0,
		y: 1.0,
	},
	bounds: {
		x: 0.0,
		y: 0.0,
	},
	bounds_rel: {
		x: 0.0,
		y: 0.0,
	},
	scale_filter: "disable",
	blend_method: "default",
	blend_type: "normal",
	show_transition: {
		duration: 0,
	},
	hide_transition: {
		duration: 0,
	},
	private_settings: {},
};

export const baseSource: z.infer<typeof sourceSchema> = {
	prev_ver: 0,
	name: "",
	uuid: "",
	id: "",
	versioned_id: "",
	settings: {},
	mixers: 0,
	sync: 0,
	flags: 0,
	volume: 1,
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
};

interface TransformOptions {
	// Position in pixels (x=0, y=0 is top left of screen)
	x: number;
	y: number;

	// Scale multiplier (1 = 100%, 0.5 = 50%)
	scaleX?: number;
	scaleY?: number;

	// Rotation in degrees
	rotation?: number;

	// Pixels to cut off the source edges
	crop?: {
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
	};
}

export function convertSourceToSceneItem(
	source: z.infer<typeof sourceSchema>,
	transformOptions?: TransformOptions,
	itemOverrides?: Partial<z.infer<typeof sceneItemSchema>>,
): z.infer<typeof sceneItemSchema> {
	return {
		...baseSceneItem,
		name: source.name,
		source_uuid: source.uuid,
		pos: {
			x: transformOptions?.x ?? 0,
			y: transformOptions?.y ?? 0,
		},
		pos_rel: {
			x: (2 * (transformOptions?.x ?? 0) - 1920) / 1080,
			y: (2 * (transformOptions?.y ?? 0) - 1080) / 1080,
		},
		scale: {
			x: transformOptions?.scaleX ?? 1.0,
			y: transformOptions?.scaleY ?? 1.0,
		},
		rot: transformOptions?.rotation ?? 0.0,
		crop_top: transformOptions?.crop?.top ?? 0,
		crop_bottom: transformOptions?.crop?.bottom ?? 0,
		crop_left: transformOptions?.crop?.left ?? 0,
		crop_right: transformOptions?.crop?.right ?? 0,
		...itemOverrides,
	};
}

/** A source with optional scene item overrides (locked, order, visibility, etc.) */
export type SourceInput =
	| z.infer<typeof sourceSchema>
	| { source: z.infer<typeof sourceSchema>; overrides?: Partial<z.infer<typeof sceneItemSchema>> };

function isSourceWithOverrides(
	input: SourceInput,
): input is { source: z.infer<typeof sourceSchema>; overrides?: Partial<z.infer<typeof sceneItemSchema>> } {
	return "source" in input;
}

export function generateOBSScene(
	layoutName: string,
	sources?: (SourceInput | undefined)[],
	items?: (z.infer<typeof sceneItemSchema> | undefined)[],
): z.infer<typeof sceneSourceSchema> {
	const sceneItems =
		sources
			?.filter((input) => input !== undefined)
			.map((input, index) => {
				const source = isSourceWithOverrides(input) ? input.source : input;
				const overrides = isSourceWithOverrides(input) ? input.overrides : undefined;

				const sceneItem = convertSourceToSceneItem(source, undefined, overrides);
				return {
					...sceneItem,
					id: overrides?.id ?? index + 1, // Use override id for order, or default to array index + 1
				};
			}) ?? [];

	// Predefined items
	if (items) {
		sceneItems.push(...items.filter((item) => item !== undefined));
	}

	return {
		...baseSource,
		name: layoutName,
		id: "scene",
		versioned_id: "scene",
		uuid: crypto.randomUUID(),
		canvas_uuid: crypto.randomUUID(),
		settings: {
			id_counter: sources?.length ? sources.length + 1 : 1,
			custom_size: false,
			items: sceneItems,
		},
		hotkeys: {
			"OBSBasic.SelectScene": [],
		},
	};
}

export function generateBrowserSource(
	name: string,
	url: string,
	settings: { width: number; height: number; fps: number },
): z.infer<typeof browserSourceSchema> {
	return {
		...baseSource,
		name,
		id: "browser_source",
		versioned_id: "browser_source",
		uuid: crypto.randomUUID(),
		settings: {
			url,
			width: settings.width,
			height: settings.height,
			fps: settings.fps,
			fps_custom: settings.fps !== 30, // 30 is the default FPS
			shutdown: true,
		},
	};
}

export function generateTextLabelSource(labelText: string): z.infer<typeof textSourceSchema> {
	return {
		...baseSource,
		name: `Label - ${labelText}`,
		id: "text_gdiplus",
		versioned_id: "text_gdiplus_v3",
		uuid: crypto.randomUUID(),
		settings: {
			text: labelText,
			color: 0xffffffff, // White in ABGR
			align: "center",
			valign: "center",
			outline: true,
			outline_color: 0xff000000, // Black in ABGR
			outline_size: 3,
			font: {
				face: "Arial",
				size: 48,
				flags: 0,
				style: "Regular",
			},
		},
	};
}

export function generateColourSource(name: string, colourHex: `#${string}`): z.infer<typeof colourSourceSchema> {
	const abgr = parseInt(colourHex.slice(1).match(/.{2}/g)?.reverse().join("") ?? "00000000", 16);

	return {
		...baseSource,
		name,
		id: "color_source",
		versioned_id: "color_source_v3",
		uuid: crypto.randomUUID(),
		settings: {
			color: abgr,
		},
	};
}

export const baseOBSScenesFile: z.infer<typeof obsSceneFileSchema> = {
	current_scene: "",
	current_program_scene: "",
	scene_order: [],
	name: "Generated Profile",
	groups: [],
	"virtual-camera": {
		type2: 3,
	},
	quick_transitions: [],
	transitions: [],
	saved_projectors: [],
	current_transition: "",
	transition_duration: 300,
	preview_locked: false,
	scaling_enabled: false,
	scaling_level: 1,
	scaling_off_x: 0,
	scaling_off_y: 0,
	modules: {
		"scripts-tool": [],
		"output-timer": {
			streamTimerHours: 0,
			streamTimerMinutes: 0,
			streamTimerSeconds: 0,
			recordTimerHours: 0,
			recordTimerMinutes: 0,
			recordTimerSeconds: 0,
			autoStartStreamTimer: false,
			autoStartRecordTimer: false,
			pauseRecordTimer: false,
		},
		"auto-scene-switcher": {
			interval: 300,
			non_matching_scene: "",
			switch_if_not_matching: false,
			active: false,
			switches: [],
		},
		captions: {
			source: "",
			enabled: false,
			lang_id: 2057,
			provider: "mssapi",
		},
	},
	version: 2,
	sources: [],
};
