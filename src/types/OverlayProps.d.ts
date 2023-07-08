import { AudioIndicator } from './Audio';
import type NodeCG from '@nodecg/types';
import { RunDataActiveRun } from './RunData';
import { Timer } from './Timer';
import { Tweet } from './Twitter';

export interface OverlayRef {
	showTweet?: (newVal: Tweet) => void;
}

export interface OverlayProps {
	runData: RunDataActiveRun | undefined;
	timer: Timer | undefined;
	couchInformation: CouchPerson[];
	preview?: boolean;
	sponsors: NodeCG.AssetFile[];
	audioIndicator?: string;
	obsAudioIndicator?: AudioIndicator;
}

export interface CouchPerson {
	id: string;
	name: string;
	pronouns: string;
	host?: boolean;
	microphone?: string;
}
