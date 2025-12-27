import { TextField } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";

export function TwitchSettings() {
	const [twitchSettingsRep, setTwitchSettingsRep] = useReplicant("twitch:settings");

	if (!twitchSettingsRep) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h3>Twitch Settings</h3>
			<TextField
				label="Client ID"
				fullWidth
				value={twitchSettingsRep.clientId}
				onChange={(e) => setTwitchSettingsRep({ ...twitchSettingsRep, clientId: e.target.value })} />
		</div>
	);
}
