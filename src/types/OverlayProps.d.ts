import { AudioIndicator } from "./Audio";
import type NodeCG from "@nodecg/types";
import { RunDataActiveRun } from "./RunData";
import { Timer } from "./Timer";
import { Tweet } from "./Twitter";

export interface OverlayRef {
	showTweet?: (newVal: Tweet) => void;
}

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
