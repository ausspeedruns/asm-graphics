import {
	Button,
	TextField,
	InputAdornment,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Tooltip,
	Box,
	Typography,
} from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { ConnectionTag } from "../elements/connection-tag";
import { PasswordField } from "../elements/password-field";
import { generateOBSScenes } from "./obs-scene-generator";
import type { RunDataArray } from "@asm-graphics/shared/types/RunData";
import { useMemo, useState } from "react";
import NumberField from "../elements/number-field";

export function OBSSettings() {
	const [obsStatusRep] = useReplicant("obs:status");
	const [obsDoLocalRecordingsRep, setObsDoLocalRecordingsRep] = useReplicant("obs:localRecordings");
	const [obsAutoReconnectRep, setObsAutoReconnectRep] = useReplicant("obs:autoReconnect");
	const [obsReconnectIntervalRep, setObsReconnectIntervalRep] = useReplicant("obs:reconnectInterval");
	const [obsConnectionDetailsRep, setObsConnectionDetailsRep] = useReplicant("obs:connectionDetails");

	const [ausspeedrunsSettingsRep] = useReplicant("ausspeedruns-website:settings");
	const [runsRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });

	const allLayouts = useMemo(() => {
		const layoutsSet = new Set<string>();
		runsRep?.forEach((run) => {
			const layoutMatch = /LAYOUT:\s*(.*)/.exec(run.customData?.specialRequirements ?? "");
			if (layoutMatch) {
				const layoutName = layoutMatch[1]?.trim();
				if (layoutName) {
					layoutsSet.add(layoutName);
				}
			}
		});
		return Array.from(layoutsSet);
	}, [JSON.stringify(runsRep)]);

	const [eventShortName, setEventShortName] = useState(ausspeedrunsSettingsRep?.eventSlug ?? "AusSpeedruns");
	const [gameplayCaptures, setGameplayCaptures] = useState(2);
	const [cameraCaptures, setCameraCaptures] = useState(2);
	const [makeASNNScenes, setMakeASNNScenes] = useState(false);

	function handleGenerateOBSSceneFile() {
		const data = generateOBSScenes({
			name: eventShortName,
			numberOfCameraCaptures: cameraCaptures,
			numberOfGameplayCaptures: gameplayCaptures,
			urlBase: window.location.origin,
			asnn: false,
			gameplayLayouts: allLayouts,
		});

		console.log("Generated OBS Scene File:", data);

		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
		const downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", `${eventShortName}-obs-scenes.json`);
		document.body.appendChild(downloadAnchorNode);
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}

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
					disabled={obsStatusRep?.status === "connected"}
					loading={obsStatusRep?.status === "connecting"}
					onClick={() => void nodecg.sendMessage("obs:setConnected", true)}
				>
					Connect
				</Button>
				<Button
					variant="contained"
					color="error"
					fullWidth
					disabled={obsStatusRep?.status === "disconnected"}
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
				<NumberField
					label="Reconnect Interval (ms)"
					value={obsReconnectIntervalRep}
					onValueChange={(value) => setObsReconnectIntervalRep(value ?? 5000)}
				/>
			</FormGroup>
			<Typography
				variant="overline"
				sx={{
					display: "block",
					mt: 3,
					mb: 0.5,
					fontWeight: "bold",
					borderTop: "1px solid rgba(255,255,255,0.1)",
					pt: 2,
				}}
			>
				Scene Generator
			</Typography>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
				<TextField
					label="Event Short Name"
					value={eventShortName}
					onChange={(e) => setEventShortName(e.target.value)}
					fullWidth
					size="small"
				/>
				<Box sx={{ display: "flex", gap: 1 }}>
					<NumberField
						label="Gameplay Captures"
						value={gameplayCaptures}
						onValueChange={(value) => setGameplayCaptures(value ?? 2)}
						size="small"
						fullWidth
						min={0}
					/>
					<NumberField
						label="Camera Captures"
						value={cameraCaptures}
						onValueChange={(value) => setCameraCaptures(value ?? 2)}
						size="small"
						fullWidth
						min={0}
					/>
				</Box>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<FormControlLabel
						disabled
						control={
							<Checkbox
								size="small"
								checked={makeASNNScenes}
								onChange={(e) => setMakeASNNScenes(e.target.checked)}
							/>
						}
						label={<Typography variant="body2">Generate ASNN Scenes</Typography>}
					/>
					<Tooltip
						arrow
						title={
							<Box sx={{ p: 0.5 }}>
								<Typography variant="caption" sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}>
									Detected Gameplay Layouts:
								</Typography>
								{allLayouts.length > 0 ? (
									<ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.75rem" }}>
										{allLayouts.map((layout) => (
											<li key={layout}>{layout}</li>
										))}
									</ul>
								) : (
									<Typography variant="caption">No layouts detected</Typography>
								)}
							</Box>
						}
					>
						<Typography
							variant="caption"
							sx={{
								cursor: "help",
								color: "primary.main",
								borderBottom: "1px dashed",
								pb: 0.2,
							}}
						>
							View Layouts ({allLayouts.length})
						</Typography>
					</Tooltip>
				</Box>
				<Button variant="outlined" onClick={handleGenerateOBSSceneFile} fullWidth size="small">
					Generate OBS Scene File
				</Button>
			</Box>
		</div>
	);
}
