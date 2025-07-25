import { AudioIndicator } from "./Audio";
import type NodeCG from "nodecg/types";
import { RunDataActiveRun } from "./RunData";
import { Timer } from "./Timer";

export interface OverlayProps {
	runData: RunDataActiveRun | undefined;
	timer: Timer | undefined;
	commentators: Commentator[];
	host?: Commentator;
	preview?: boolean;
	sponsors: NodeCG.AssetFile[];
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
