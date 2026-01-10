import { Alert, Button, Snackbar, Stack, TextField } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { PasswordField } from "../elements/password-field";
import { useState } from "react";
import NumberField from "../elements/number-field";

export function AusSpeedrunsWebsiteSettings() {
	const [ausSpeedrunsWebsiteSettings, setAusSpeedrunsWebsiteSettings] = useReplicant("ausspeedruns-website:settings");
	const [gettingUsers, setGettingUsers] = useState(false);
	const [gettingIncentives, setGettingIncentives] = useState(false);
	const [notification, setNotification] = useState<{
		message: string;
		severity: "success" | "error" | "info" | "warning";
	} | null>(null);

	if (!ausSpeedrunsWebsiteSettings) {
		return <div>Loading...</div>;
	}

	function recollectUserData() {
		setGettingUsers(true);
		nodecg.sendMessage("ausspeedruns-website:recollectUserData", (error, response) => {
			if (error) {
				console.error("Error recollecting user data:", error);
				setNotification({ message: "Error recollecting user data", severity: "error" });
			} else {
				console.info("Successfully recollected user data:", response);
				setNotification({ message: "Successfully recollected user data", severity: "success" });
			}
			setGettingUsers(false);
		});
	}

	function recollectIncentiveData() {
		setGettingIncentives(true);
		nodecg.sendMessage("refreshIncentives", (error, response) => {
			if (error) {
				console.error("Error recollecting incentive data:", error);
				setNotification({ message: "Error recollecting incentive data", severity: "error" });
			} else {
				console.info("Successfully recollected incentive data:", response);
				setNotification({ message: "Successfully recollected incentive data", severity: "success" });
			}
			setGettingIncentives(false);
		});
	}

	function clearNotification() {
		setNotification(null);
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
				onChange={(text) => setAusSpeedrunsWebsiteSettings({ ...ausSpeedrunsWebsiteSettings, apiKey: text })}
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

			<NumberField
				label="Incentive Update Interval (ms)"
				value={ausSpeedrunsWebsiteSettings.incentiveRefreshInterval}
				onValueChange={(value) => {
					if (value !== null) {
						setAusSpeedrunsWebsiteSettings({
							...ausSpeedrunsWebsiteSettings,
							incentiveRefreshInterval: value,
						});
					}
				}}
				min={0}
				fullWidth
			/>

			<Stack direction="row" spacing={2} alignItems="center" marginY={2}>
				<Button fullWidth onClick={recollectUserData} disabled={gettingUsers} loading={gettingUsers}>
					Recollect user data
				</Button>
				<Button
					fullWidth
					onClick={recollectIncentiveData}
					disabled={gettingIncentives}
					loading={gettingIncentives}
				>
					Recollect incentive data
				</Button>
			</Stack>

			<Snackbar
				open={notification !== null}
				autoHideDuration={6000}
				onClose={clearNotification}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={clearNotification}
					severity={notification?.severity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{notification?.message}
				</Alert>
			</Snackbar>
		</div>
	);
}
