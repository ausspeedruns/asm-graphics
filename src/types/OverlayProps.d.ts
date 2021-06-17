import { RunDataActiveRun, RunDataPlayer } from './RunData';
import { Timer } from './Timer';

export interface OverlayProps {
	runData: RunDataActiveRun | undefined;
	timer: Timer | undefined;
	couchInformation: CouchInformation;
	preview?: boolean;
}

export interface CouchInformation {
	current: CouchPerson[];
	preview: CouchPerson[];
}

export interface CouchPerson {
	name: string;
	pronouns: string;
}