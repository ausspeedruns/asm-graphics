import { text } from "node:stream/consumers";
import { size } from "underscore";
import { z } from "zod";

// #region Scene Item Schema

export const sceneItemSchema = z.object({
	name: z.string().meta({ description: "Item name" }),
	source_uuid: z.uuidv4().meta({ description: "UUID of the source this item references" }),
	visible: z.boolean().meta({ description: "Whether the item is visible" }),
	locked: z.boolean().meta({ description: "Whether the item is locked" }),
	rot: z.number().meta({ description: "Rotation of the item in degrees" }),
	scale_ref: z
		.object({
			x: z.number().meta({ description: "Reference width for scaling in pixels" }),
			y: z.number().meta({ description: "Reference height for scaling in pixels" }),
		})
		.meta({ description: "Scale reference of the item" }),
	align: z.int().meta({ description: "Alignment of the item (unknown use TODO)" }),
	bounds_type: z.int().meta({ description: "Bounds type of the item (unknown use TODO)" }),
	bounds_align: z.int().meta({ description: "Bounds alignment of the item (unknown use TODO)" }),
	bounds_crop: z.boolean().meta({ description: "Whether bounds cropping is enabled" }),
	crop_left: z.number().nonnegative().meta({ description: "Left crop in pixels" }),
	crop_top: z.number().nonnegative().meta({ description: "Top crop in pixels" }),
	crop_right: z.number().nonnegative().meta({ description: "Right crop in pixels" }),
	crop_bottom: z.number().nonnegative().meta({ description: "Bottom crop in pixels" }),
	id: z.int().nonnegative().meta({ description: "Item ID TODO" }),
	group_item_backup: z.boolean().meta({ description: "TODO" }),
	pos: z
		.object({
			x: z.number().meta({ description: "X position of the item in pixels" }),
			y: z.number().meta({ description: "Y position of the item in pixels" }),
		})
		.meta({ description: "Position of the item" }),
	pos_rel: z.object({
		x: z.number().meta({ description: "Relative X position of the item (unknown use TODO)" }),
		y: z.number().meta({ description: "Relative Y position of the item (unknown use TODO)" }),
	}),
	scale: z
		.object({
			x: z.number().meta({ description: "X scale factor of the item" }),
			y: z.number().meta({ description: "Y scale factor of the item" }),
		})
		.meta({ description: "Scale of the item" }),
	scale_rel: z.object({
		x: z.number().meta({ description: "Relative X scale factor of the item (unknown use TODO)" }),
		y: z.number().meta({ description: "Relative Y scale factor of the item (unknown use TODO)" }),
	}),
	bounds: z
		.object({
			x: z.number().meta({ description: "Width of the bounds in pixels" }),
			y: z.number().meta({ description: "Height of the bounds in pixels" }),
		})
		.meta({ description: "Bounds of the item" }),
	bounds_rel: z.object({
		x: z.number().meta({ description: "Relative width of the bounds (unknown use TODO)" }),
		y: z.number().meta({ description: "Relative height of the bounds (unknown use TODO)" }),
	}),
	scale_filter: z.string().meta({ description: "Scale filter (unknown use TODO)" }),
	blend_method: z.string().meta({ description: "Blend method (unknown use TODO)" }),
	blend_type: z.string().meta({ description: "Blend type (unknown use TODO)" }),
	show_transition: z
		.object({
			duration: z.number().nonnegative().meta({ description: "Duration of the show transition in milliseconds" }),
		})
		.meta({ description: "Show transition settings" }),
	hide_transition: z
		.object({
			duration: z.number().nonnegative().meta({ description: "Duration of the hide transition in milliseconds" }),
		})
		.meta({ description: "Hide transition settings" }),
	private_settings: z
		.record(z.string(), z.unknown())
		.meta({ description: "Private settings (unknown structure TODO)" }),
});

// #region Source Schemas

export const sourceSchema = z.object({
	prev_ver: z.number().meta({ description: "TODO" }),
	name: z.string().meta({ description: "Source name" }),
	uuid: z.uuidv4().meta({ description: "Source UUID" }),
	id: z.string().meta({ description: "Source type ID" }),
	versioned_id: z.string().meta({ description: "Versioned source type ID (unsure of difference TODO)" }),
	settings: z.record(z.string(), z.unknown()).meta({ description: "Settings specific to the source type" }),
	mixers: z.int().nonnegative().meta({ description: "TODO" }),
	sync: z.int().nonnegative().meta({ description: "TODO" }),
	flags: z.int().nonnegative().meta({ description: "TODO" }),
	volume: z.number().min(0).max(1).meta({ description: "Volume level (0.0 to 1.0)" }),
	balance: z.number().min(0).max(1).meta({ description: "Balance level (0.0 to 1.0, 0.5 is center)" }),
	enabled: z.boolean().meta({ description: "Whether the source is enabled" }),
	muted: z.boolean().meta({ description: "Whether the source is muted" }),
	"push-to-mute": z.boolean().meta({ description: "Whether push-to-mute is enabled (TODO)" }),
	"push-to-mute-delay": z
		.number()
		.nonnegative()
		.meta({ description: "Delay for push-to-mute in milliseconds (TODO)" }),
	"push-to-talk": z.boolean().meta({ description: "Whether push-to-talk is enabled (TODO)" }),
	"push-to-talk-delay": z
		.number()
		.nonnegative()
		.meta({ description: "Delay for push-to-talk in milliseconds (TODO)" }),
	hotkeys: z.record(z.string(), z.unknown()).meta({ description: "Hotkeys for the browser source" }),
	deinterlace_mode: z.int().nonnegative().meta({ description: "Deinterlace mode (TODO)" }),
	deinterlace_field_order: z.int().nonnegative().meta({ description: "Deinterlace field order (TODO)" }),
	monitoring_type: z.int().nonnegative().meta({ description: "Monitoring type (TODO)" }),
	private_settings: z
		.record(z.string(), z.unknown())
		.meta({ description: "Private settings (unknown structure TODO)" }),
	filters: z.optional(z.array(z.unknown())).meta({ description: "Filters applied to the source (TODO)" }),
});

export const sceneSourceSchema = z.object({
	...sourceSchema.shape,
	id: z.literal("scene").meta({ description: "Source type ID" }),
	versioned_id: z.literal("scene").meta({ description: "Versioned source type ID (unsure of difference TODO)" }),
	settings: z
		.object({
			custom_size: z.boolean().meta({ description: "TODO" }),
			id_counter: z.number().nonnegative().optional().meta({ description: "TODO" }),
			items: z.array(sceneItemSchema).meta({ description: "Items in the scene" }),
		})
		.meta({ description: "Settings specific to the scene source" }),
	hotkeys: z
		.object({
			"OBSBasic.SelectScene": z.array(z.unknown()).meta({ description: "TODO" }),
		})
		.meta({ description: "Hotkeys for the scene source" }),
	canvas_uuid: z.uuidv4().meta({ description: "Canvas UUID (TODO)" }),
});

export const browserSourceSchema = z.object({
	...sourceSchema.shape,
	id: z.literal("browser_source").meta({ description: "Source type ID" }),
	versioned_id: z
		.literal("browser_source")
		.meta({ description: "Versioned source type ID (unsure of difference TODO)" }),
	settings: z
		.object({
			url: z.url().meta({ description: "URL of the browser source" }),
			width: z.int().positive().meta({ description: "Width of the browser source in pixels" }),
			height: z.int().positive().meta({ description: "Height of the browser source in pixels" }),
			fps: z.int().positive().meta({ description: "Frames per second" }),
			fps_custom: z.boolean().meta({ description: "Whether a custom FPS is set" }),
			shutdown: z
				.boolean()
				.optional()
				.meta({ description: "Whether to shutdown the browser source when not in use" }),
		})
		.meta({ description: "Settings specific to the browser source" }),
});

export const videoCaptureSourceSchema = z.object({
	...sourceSchema.shape,
	id: z.literal("dshow_input").meta({ description: "Source type ID" }),
	versioned_id: z
		.literal("dshow_input")
		.meta({ description: "Versioned source type ID (unsure of difference TODO)" }),
	settings: z
		.object({
			video_device_id: z.string().meta({ description: "Device ID of the video capture device" }),
			last_video_device_id: z
				.string()
				.meta({ description: "Last used device ID of the video capture device (TODO)" }),
		})
		.meta({ description: "Settings specific to the video capture source" }),
});

export const audioCaptureSourceSchema = z.object({
	...sourceSchema.shape,
	id: z.literal("wasapi_input_capture").meta({ description: "Source type ID" }),
	versioned_id: z
		.literal("wasapi_input_capture")
		.meta({ description: "Versioned source type ID (unsure of difference TODO)" }),
	settings: z
		.object({
			device_id: z.string().meta({ description: "Device ID of the audio capture device" }),
		})
		.meta({ description: "Settings specific to the audio capture source" }),
});

export const textSourceSchema = z.object({
	...sourceSchema.shape,
	id: z.literal("text_gdiplus").meta({ description: "Source type ID" }),
	versioned_id: z
		.literal("text_gdiplus_v3")
		.meta({ description: "Versioned source type ID (unsure of difference TODO)" }),
	settings: z
		.object({
			text: z.string().meta({ description: "Text content" }),
			color: z.int().meta({ description: "Text colour (ABGR integer)" }),
			align: z.literal(["left", "center", "right"]).meta({ description: "Text alignment" }),
			valign: z.literal(["top", "center", "bottom"]).meta({ description: "Vertical alignment" }),
			outline: z.boolean().meta({ description: "Whether outline is enabled" }),
			outline_color: z.int().meta({ description: "Outline colour (ABGR integer)" }),
			outline_size: z.int().nonnegative().meta({ description: "Outline size" }),
			font: z
				.object({
					face: z.string().meta({ description: "Font face" }),
					style: z.string().meta({ description: "Font style" }),
					size: z.int().positive().meta({ description: "Font size" }),
					flags: z.int().nonnegative().meta({ description: "Font flags (TODO)" }),
				})
				.meta({ description: "Font settings" }),
		})
		.meta({ description: "Settings specific to the text source" }),
});

export const colourSourceSchema = z.object({
	...sourceSchema.shape,
	id: z.literal("color_source").meta({ description: "Source type ID" }),
	versioned_id: z
		.literal("color_source_v3")
		.meta({ description: "Versioned source type ID (unsure of difference TODO)" }),
	settings: z.object({
		color: z.number().positive().optional().meta({ description: "Colour (ABGR integer)" }),
		width: z.int().positive().optional().meta({ description: "Width in pixels" }),
		height: z.int().positive().optional().meta({ description: "Height in pixels" }),
	}),
});

export const imageSourceSchema = z.object({
	...sourceSchema.shape,
	id: z.literal("image_source").meta({ description: "Source type ID" }),
	versioned_id: z
		.literal("image_source")
		.meta({ description: "Versioned source type ID (unsure of difference TODO)" }),
	settings: z.object({
		file: z.string().meta({ description: "File path of the image source" }),
	}),
});

export const sourceItems = [
	sceneSourceSchema,
	browserSourceSchema,
	videoCaptureSourceSchema,
	audioCaptureSourceSchema,
	textSourceSchema,
	colourSourceSchema,
	imageSourceSchema,
];

// #region Transition Schemas

export const baseTransitionSchema = z.object({
	name: z.string().meta({ description: "Transition name" }),
	id: z.string().meta({ description: "Transition type ID" }),
});

export const stringerTransitionSchema = z.object({
	...baseTransitionSchema.shape,
	id: z.literal("obs_stinger_transition").meta({ description: "OBS Stinger Transition type ID" }),
	settings: z.object({
		transition_point: z.number().nonnegative().meta({ description: "Transition point in milliseconds" }),
		path: z.string().meta({ description: "Path to the stinger file" }),
	}),
});

export const quickTransitionSchema = z.object({
	name: z.string().meta({ description: "Transition name" }),
	duration: z.number().nonnegative().meta({ description: "Duration of the transition in milliseconds" }),
	hotkeys: z.array(z.unknown()).meta({ description: "TODO" }),
	id: z.number().nonnegative().meta({ description: "Transition type ID (number instead of string TODO)" }),
	fade_to_black: z.boolean().meta({ description: "Whether to fade to black during the transition" }),
});

// #region OBS Scene File Schema

export const obsSceneFileSchema = z
	.object({
		current_scene: z.string().meta({ description: "Name of the current scene" }),
		current_program_scene: z.string().meta({ description: "Name of the current program scene" }),
		scene_order: z
			.array(
				z.object({
					name: z.string().meta({ description: "Name of the scene" }),
				}),
			)
			.meta({ description: "Order of scenes by name" }),
		name: z.string().meta({ description: "Name of the OBS profile" }),
		groups: z.array(z.unknown()).meta({ description: "Groups/Folders in scenes TODO" }),
		quick_transitions: z.array(z.union([quickTransitionSchema])).meta({ description: "TODO" }),
		transitions: z.array(z.union([stringerTransitionSchema])).meta({ description: "TODO" }),
		saved_projectors: z.array(z.unknown()).meta({ description: "TODO" }),
		current_transition: z.string().meta({ description: "Name of the current transition" }),
		transition_duration: z
			.number()
			.nonnegative()
			.meta({ description: "Duration of the transition in milliseconds" }),
		preview_locked: z.boolean().meta({ description: "Whether the preview is locked (TODO)" }),
		scaling_enabled: z.boolean().meta({ description: "Whether scaling is enabled (TODO)" }),
		scaling_level: z.number().meta({ description: "Scaling level (TODO)" }),
		scaling_off_x: z.number().meta({ description: "Scaling offset on the X axis (TODO)" }),
		scaling_off_y: z.number().meta({ description: "Scaling offset on the Y axis (TODO)" }),
		"virtual-camera": z
			.object({
				type2: z.number().meta({ description: "TODO" }),
			})
			.meta({ description: "Virtual camera settings (TODO)" }),
		modules: {
			"scripts-tool": z.array(z.unknown()).meta({ description: "TODO" }),
			"output-timer": z
				.object({
					streamTimerHours: z
						.number()
						.nonnegative()
						.meta({ description: "Hours for the stream timer (TODO)" }),
					streamTimerMinutes: z
						.number()
						.nonnegative()
						.meta({ description: "Minutes for the stream timer (TODO)" }),
					streamTimerSeconds: z
						.number()
						.nonnegative()
						.meta({ description: "Seconds for the stream timer (TODO)" }),
					recordTimerHours: z
						.number()
						.nonnegative()
						.meta({ description: "Hours for the record timer (TODO)" }),
					recordTimerMinutes: z
						.number()
						.nonnegative()
						.meta({ description: "Minutes for the record timer (TODO)" }),
					recordTimerSeconds: z
						.number()
						.nonnegative()
						.meta({ description: "Seconds for the record timer (TODO)" }),
					autoStartStreamTimer: z
						.boolean()
						.meta({ description: "Whether to auto start the stream timer (TODO)" }),
					autoStartRecordTimer: z
						.boolean()
						.meta({ description: "Whether to auto start the record timer (TODO)" }),
					pauseRecordTimer: z.boolean().meta({ description: "Whether to pause the record timer (TODO)" }),
				})
				.meta({ description: "Output timer settings (TODO)" }),
			"auto-scene-switcher": z
				.object({
					interval: z
						.number()
						.nonnegative()
						.meta({ description: "Interval for scene switching in seconds (TODO)" }),
					non_matching_scene: z
						.string()
						.meta({ description: "Scene to switch to if no match is found (TODO)" }),
					switch_if_not_matching: z
						.boolean()
						.meta({ description: "Whether to switch if no match is found (TODO)" }),
					active: z.boolean().meta({ description: "Whether the auto scene switcher is active (TODO)" }),
					switches: z.array(z.unknown()).meta({ description: "List of scene switches (TODO)" }),
				})
				.meta({ description: "Auto scene switcher settings (TODO)" }),
			captions: z
				.object({
					source: z.string().meta({ description: "Caption source (TODO)" }),
					enabled: z.boolean().meta({ description: "Whether captions are enabled (TODO)" }),
					lang_id: z.number().meta({ description: "Language ID for captions (TODO)" }),
					provider: z.string().meta({ description: "Caption provider (TODO)" }),
				})
				.meta({ description: "Captions settings (TODO)" }),
		},
		version: z.literal(2).meta({ description: "Version of the OBS scene file format" }),
		sources: z.array(z.union(sourceItems)).meta({ description: "List of sources and scenes" }),
	})
	.strict()
	.meta({ description: "Schema for an OBS scene file" });
