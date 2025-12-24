import type { AudioIndicator } from "./Audio.js";
import type NodeCG from "nodecg/types";
import type { RunDataActiveRun, RunDataPlayer } from "./RunData.js";
import type { Timer } from "./Timer.js";

export interface OverlayProps {
	runData: RunDataActiveRun | undefined;
	timer: Timer | undefined;
	commentators: RunDataPlayer[];
	host?: RunDataPlayer;
	preview?: boolean;
	sponsors: NodeCG.default.AssetFile[];
	gameAudioIndicator: number;
	microphoneAudioIndicator?: AudioIndicator;
	onScreenWarning?: { message: string; show: boolean };
	showHost?: boolean;
}
