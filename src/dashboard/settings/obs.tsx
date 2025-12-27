import { useState } from "react";
import { Button, TextField, InputAdornment, FormGroup, FormControlLabel, Checkbox, IconButton } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { ConnectionTag } from "../elements/connection-tag";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { PasswordField } from "../elements/password-field";

export function OBSSettings() {
	const [obsStatusRep] = useReplicant("obs:status");
	const [obsDoLocalRecordingsRep, setObsDoLocalRecordingsRep] = useReplicant("obs:localRecordings");
	const [obsAutoReconnectRep, setObsAutoReconnectRep] = useReplicant("obs:autoReconnect");
	const [obsReconnectIntervalRep, setObsReconnectIntervalRep] = useReplicant("obs:reconnectInterval");
	const [obsConnectionDetailsRep, setObsConnectionDetailsRep] = useReplicant("obs:connectionDetails");

	return (
		<div>
			<h3>
				OBS <ConnectionTag status={obsStatusRep} />
			</h3>
			<div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
				<Button
					variant="contained"
					color="success"
					fullWidth
					disabled={obsStatusRep === "connected"}
					loading={obsStatusRep === "connecting"}
					onClick={() => void nodecg.sendMessage("obs:setConnected", true)}
				>
					Connect
				</Button>
				<Button
					variant="contained"
					color="error"
					fullWidth
					disabled={obsStatusRep === "disconnected"}
					onClick={() => void nodecg.sendMessage("obs:setConnected", false)}
				>
					Disconnect
				</Button>
			</div>
			<TextField
				label="OBS Address"
				fullWidth
				margin="dense"
				value={obsConnectionDetailsRep?.address}
				onChange={(e) => {
					if (obsConnectionDetailsRep) {
						setObsConnectionDetailsRep({
							...obsConnectionDetailsRep,
							address: e.target.value ?? "",
						});
					}
				}}
			/>
			<PasswordField
				label="OBS Password"
				value={obsConnectionDetailsRep?.password ?? ""}
				onChange={(text) => {
					if (obsConnectionDetailsRep) {
						setObsConnectionDetailsRep({
							...obsConnectionDetailsRep,
							password: text,
						});
					}
				}}
			/>

			<FormGroup>
				<FormControlLabel
					control={
						<Checkbox
							checked={obsDoLocalRecordingsRep ?? false}
							onChange={(e) => setObsDoLocalRecordingsRep(e.target.checked)}
						/>
					}
					label="Enable OBS Local Recordings"
				/>

				<FormControlLabel
					control={
						<Checkbox
							checked={obsAutoReconnectRep ?? false}
							onChange={(e) => setObsAutoReconnectRep(e.target.checked)}
						/>
					}
					label="Auto-reconnect to OBS"
				/>
				<TextField
					label="Reconnect Interval (ms)"
					slotProps={{ input: { endAdornment: <InputAdornment position="end">ms</InputAdornment> } }}
					type="number"
					fullWidth
					value={obsReconnectIntervalRep}
					onChange={(e) => setObsReconnectIntervalRep(Number(e.target.value))}
				/>
			</FormGroup>
		</div>
	);
}
