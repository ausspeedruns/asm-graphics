import { Button, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { ConnectionTag } from "../elements/connection-tag";
import { WbIncandescent } from "@mui/icons-material";
import { AudioSlider } from "../elements/audio-slider";

export function X32Settings() {
	const [x32StatusRep] = useReplicant("x32:status");
	const [x32ConnectionDetailsRep, setX32ConnectionDetailsRep] = useReplicant("x32:connectionDetails");

	const [audioGateRep, setAudioGateRep] = useReplicant("x32:audio-gate");

	return (
		<div>
			<h3>
				X32 <ConnectionTag status={x32StatusRep} />
			</h3>
			<div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
				<Button
					variant="contained"
					color="success"
					fullWidth
					disabled={x32StatusRep === "connected"}
					loading={x32StatusRep === "connecting"}
					onClick={() => void nodecg.sendMessage("x32:setConnected", true)}
				>
					Connect
				</Button>
				<Button
					variant="contained"
					color="error"
					fullWidth
					disabled={x32StatusRep === "disconnected"}
					onClick={() => void nodecg.sendMessage("x32:setConnected", false)}
				>
					Disconnect
				</Button>
			</div>
			<FormGroup>
				<TextField
					label="X32 IP Address"
					fullWidth
					margin="dense"
					value={x32ConnectionDetailsRep?.ip ?? ""}
					onChange={(e) => setX32ConnectionDetailsRep({ ...x32ConnectionDetailsRep, ip: e.target.value })}
				/>
				<FormControlLabel
					control={<AudioSlider value={audioGateRep ?? 0} onChange={setAudioGateRep} />}
					label={
						<>
							<WbIncandescent /> Microphone Indicator Activation dB
						</>
					}
				/>
			</FormGroup>
		</div>
	);
}
