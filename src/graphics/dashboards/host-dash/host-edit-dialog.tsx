import { Dialog, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import { HostName } from "./host-name";

interface HostEditDialogProps extends DialogProps {
	submit: () => void;
}

export const HostEditDialog = (props: HostEditDialogProps) => {
	return (
		<Dialog {...props}>
			<DialogTitle>Edit Host Information</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<HostName vertical updateCb={props.submit} />
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};
