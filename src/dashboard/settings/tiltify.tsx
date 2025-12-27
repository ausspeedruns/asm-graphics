import { FormGroup, TextField, Button } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { ConnectionTag } from "../elements/connection-tag";
import { useState } from "react";
import { PasswordField } from "../elements/password-field";

export function TiltifySettings() {
	const [tiltifyConnectedRep] = useReplicant("tiltify:status");
	const [tiltifyConnectionDetailsRep, setTiltifyConnectionDetailsRep] = useReplicant("tiltify:connectionDetails");

	const [showPassword, setShowPassword] = useState(false);

	function connectTiltify() {
		void nodecg.sendMessage("tiltify:setConnection", true);
	}

	return (
		<div>
			<h3>
				Tiltify V5 <ConnectionTag status={tiltifyConnectedRep} />
			</h3>
			<FormGroup>
				<div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
					<Button
						variant="contained"
						color="success"
						fullWidth
						disabled={tiltifyConnectedRep === "connected"}
						loading={tiltifyConnectedRep === "connecting"}
						onClick={() => void nodecg.sendMessage("tiltify:setConnection", true)}
					>
						Connect
					</Button>
					<Button
						variant="contained"
						color="error"
						fullWidth
						disabled={tiltifyConnectedRep === "disconnected"}
						onClick={() => void nodecg.sendMessage("tiltify:setConnection", false)}
					>
						Disconnect
					</Button>
				</div>
				<TextField
					label="Campaign ID"
					fullWidth
					margin="dense"
					value={tiltifyConnectionDetailsRep?.campaignId ?? ""}
					onChange={(e) => {
						if (tiltifyConnectionDetailsRep) {
							setTiltifyConnectionDetailsRep({
								...tiltifyConnectionDetailsRep,
								campaignId: e.target.value ?? "",
							});
						}
					}}
				/>
				<TextField
					label="Client ID"
					fullWidth
					margin="dense"
					value={tiltifyConnectionDetailsRep?.clientId ?? ""}
					onChange={(e) => {
						if (tiltifyConnectionDetailsRep) {
							setTiltifyConnectionDetailsRep({
								...tiltifyConnectionDetailsRep,
								clientId: e.target.value ?? "",
							});
						}
					}}
				/>
				<PasswordField
					label="Client Secret"
					value={tiltifyConnectionDetailsRep?.clientSecret ?? ""}
					onChange={(text) => {
						if (tiltifyConnectionDetailsRep) {
							setTiltifyConnectionDetailsRep({
								...tiltifyConnectionDetailsRep,
								clientSecret: text,
							});
						}
					}}
				/>
			</FormGroup>
		</div>
	);
}
