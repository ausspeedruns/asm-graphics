import { TextField } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { PasswordField } from "../elements/password-field";

export function AusSpeedrunsWebsiteSettings() {
	const [ausSpeedrunsWebsiteSettings, setAusSpeedrunsWebsiteSettings] = useReplicant("ausspeedruns-website:settings");

	if (!ausSpeedrunsWebsiteSettings) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h3>AusSpeedruns Website Settings</h3>
			<TextField
				label="Event Slug"
				fullWidth
				value={ausSpeedrunsWebsiteSettings.eventSlug}
				onChange={(e) =>
					setAusSpeedrunsWebsiteSettings({ ...ausSpeedrunsWebsiteSettings, eventSlug: e.target.value })
				}
				margin="dense"
			/>
			<PasswordField
				label="API Key"
				value={ausSpeedrunsWebsiteSettings.apiKey}
				onChange={(text) =>
					setAusSpeedrunsWebsiteSettings({ ...ausSpeedrunsWebsiteSettings, apiKey: text })
				}
			/>
			<TextField
				label="URL"
				fullWidth
				value={ausSpeedrunsWebsiteSettings.url}
				onChange={(e) =>
					setAusSpeedrunsWebsiteSettings({ ...ausSpeedrunsWebsiteSettings, url: e.target.value })
				}
				margin="dense"
			/>
		</div>
	);
}
