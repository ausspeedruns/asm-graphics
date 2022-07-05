import { Asset } from './nodecg';
import { RunDataActiveRun, RunDataPlayer } from './RunData';
import { Timer } from './Timer';
import { Tweet } from './Twitter';

export interface OverlayRef {
	showTweet?: (newVal: Tweet) => void;
}

export interface OverlayProps {
	runData: RunDataActiveRun | undefined;
	timer: Timer | undefined;
	couchInformation: CouchInformation;
	preview?: boolean;
	noCam: NoCam;
	sponsors: Asset[];
	audioIndicator?: string;
}

export interface CouchInformation {
	current: CouchPerson[];
	preview: CouchPerson[];
}

export interface CouchPerson {
	name: string;
	pronouns: string;
	discordID?: string;
	host?: boolean;
}

export interface NoCam {
	preview: boolean;
	current: boolean;
}
