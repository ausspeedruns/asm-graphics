import { OverlayProps } from "@asm-graphics/types/OverlayProps";
import { RunDataPlayer } from "@asm-graphics/types/RunData";
import { Timer } from "@asm-graphics/types/Timer";

export const DefaultTimer: Timer = {
	milliseconds: 45296700,
	state: "running",
	time: "12:34:56",
	timestamp: 0,
	teamFinishTimes: {},
};

export const DefaultPlayer: RunDataPlayer = {
	name: "TestName",
	pronouns: "He/Him",
	social: {
		twitch: "TestTwitch",
	},
	country: "AU",
	teamID: "0",
	customData: {},
	id: "0",
};

export const DefaultOverlay: OverlayProps = {
	preview: false,
	commentators: [
		{ name: "Couch 1", pronouns: "He/Him", id: "" },
	],
	host: { name: "Host Name", pronouns: "She/Her", id: "" },
	runData: {
		game: "Long Game Title",
		category: "Any%",
		estimate: "1:00:00",
		release: "2000",
		system: "SNES",
		id: "",
		teams: [{ players: [DefaultPlayer], name: "", id: "0" }],
		customData: {},
	},
	sponsors: [],
	timer: DefaultTimer,
};
