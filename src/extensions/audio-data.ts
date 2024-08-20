export type Headset = {
	name: string;
	colour: string;
	textColour: "#fff" | "#000";
	mixBus: number;
	micInput: number;
};

export const OBSChannel = 7;

export const GameInputChannels = [9, 11, 13, 15] as const; // Channels are paired as stereo pairs so we only need to mute just one side

export const HandheldMicChannel = 6;

export const HostHeadset: Headset = { name: "Host", micInput: 5, colour: "#000000", textColour: "#fff", mixBus: 11 } as const;

export const Headsets = [
	{ name: "Mario Red", colour: "#ff0000", textColour: "#fff", mixBus: 3, micInput: 1 },
	{ name: "Sonic Blue", colour: "#0000ff", textColour: "#fff", mixBus: 5, micInput: 2 },
	{ name: "Pikachu Yellow", colour: "#ffff00", textColour: "#000", mixBus: 7, micInput: 3 },
	{ name: "Link Green", colour: "#006400", textColour: "#fff", mixBus: 9, micInput: 4 },
	HostHeadset,
	{ name: "NONE", colour: "#000", textColour: "#fff", mixBus: -1, micInput: -1 },
] as const;

export const PreviewMixBus = 13; // Paired with 14 via Stereo link
