export type Headset = {
	name: string;
	colour: string;
	textColour: "#fff" | "#000";
	mixBus: number;
	channel: number;
};

export const HEADSETS: Headset[] = [
	{ name: "Mario Red", colour: "#ff0000", textColour: "#fff", mixBus: 3, channel: 1 },
	{ name: "Sonic Blue", colour: "#0000ff", textColour: "#fff", mixBus: 5, channel: 2 },
	{ name: "Pikachu Yellow", colour: "#ffff00", textColour: "#000", mixBus: 7, channel: 3 },
	{ name: "Link Green", colour: "#006400", textColour: "#fff", mixBus: 9, channel: 4 },
	{ name: "Host", colour: "#000000", textColour: "#fff", mixBus: 9, channel: 5 },
];
