import { useState } from "react";
import { Button } from "@mui/material";

export function HostMicrophone() {
	const [muted, setMuted] = useState(true);
	const [couchMuted, setCouchMuted] = useState(false);

	function muteOrUnmute() {
		setMuted(!muted);
		void nodecg.sendMessage(muted ? "x32:unmute-host" : "x32:mute-host");
	}

	function muteOrUnmuteCouch() {
		setCouchMuted(!couchMuted);
		void nodecg.sendMessage(couchMuted ? "x32:host-unmute-couch" : "x32:host-mute-couch");
	}

	return (
		<div style={{ display: "flex", height: "100%" }}>
			<Button
				fullWidth
				color={muted ? "error" : "success"}
				onClick={muteOrUnmute}
				variant="contained"
				sx={{ height: "100%" }}
			>
				{muted ? "UNMUTE" : "Mute"}
			</Button>
			<Button
				color={couchMuted ? "error" : "success"}
				onClick={muteOrUnmuteCouch}
				variant="contained"
				sx={{ height: "100%" }}
			>
				{couchMuted ? "Unmute Couch" : "Mute Couch"}
			</Button>
		</div>
	);
}
