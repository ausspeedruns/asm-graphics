import { Button, FormGroup, TextField } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { ConnectionTag } from "../elements/connection-tag";
import { WbIncandescent } from "@mui/icons-material";
import { AudioSlider } from "../elements/audio-slider";

export function ShortBlockShowcase() {
	return (
		<div>
			<Button
				variant="contained"
				color="primary"
				onClick={() => void nodecg.sendMessage("asm26:bonusRuns-inject")}
			>
				Inject Short Block Showcase
			</Button>
		</div>
	);
}
