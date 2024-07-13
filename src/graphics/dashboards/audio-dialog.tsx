import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import { HostDashAudio } from "../host-dashboard-audio";

export const AudioDialog = (props: DialogProps) => {
	return (
		<Dialog maxWidth="xl" {...props}>
			<DialogTitle>Audio</DialogTitle>
			<DialogContent>
				<HostDashAudio style={{ maxWidth: "100%", width: 1000 }} />
			</DialogContent>
			<DialogActions>
				<Button onClick={(e) => props.onClose?.(e, "escapeKeyDown")} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};
