import { RunDataActiveRun, RunDataPlayer } from './RunData';
import { Timer } from './Timer';

interface OverlayProps {
	runData: RunDataActiveRun | undefined;
	timer: Timer | undefined;
	couchInformation: {
		current: string[];
		preview: string[];
	}
	preview?: boolean;
}
