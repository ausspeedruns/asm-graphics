import type { AudioIndicator } from "./Audio.js";
import type NodeCG from "nodecg/types";
import type { RunDataActiveRun } from "./RunData.js";
import type { Timer } from "./Timer.js";

export interface OverlayProps {
	runData: RunDataActiveRun | undefined;
	timer: Timer | undefined;
	commentators: Commentator[];
	host?: Commentator;
	preview?: boolean;
	sponsors: NodeCG.default.AssetFile[];
	gameAudioIndicator: number;
	microphoneAudioIndicator?: AudioIndicator;
	onScreenWarning?: { message: string; show: boolean };
	showHost?: boolean;
}

export type Commentator = {
	id: string;
	name: string;
	pronouns?: string;
	twitch?: string;
	teamId?: string;
	isRunner?: boolean;
	microphone?: string;
	tag?: string;
};
