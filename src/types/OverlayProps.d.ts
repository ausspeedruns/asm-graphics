import { RunDataActiveRun, RunDataPlayer } from './RunData';
import { Timer } from './Timer';

export interface OverlayProps {
	runData: RunDataActiveRun | undefined;
	timer: Timer | undefined;
	couchInformation: CouchInformation;
	preview?: boolean;
	noCam: NoCam;
}

export interface CouchInformation {
	current: CouchPerson[];
	preview: CouchPerson[];
}

export interface CouchPerson {
	name: string;
	pronouns: string;
}

export interface NoCam {
	preview: boolean;
	current: boolean;
}
