import { DragHandle, Delete } from "@mui/icons-material";
import { TextField, IconButton } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { UniqueIdentifier } from "@dnd-kit/core";

interface NameProps {
	id: UniqueIdentifier;
	name?: string;
	role?: string;
	onNameChange?: (value: string) => void;
	onRoleChange?: (value: string) => void;
	onDelete?: () => void;
}

export function Name(props: NameProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });

	const style = {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		width: "100%",
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.75 : 1,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<DragHandle color="action" fontSize="small" {...attributes} {...listeners} sx={{ cursor: "grab", touchAction: "none" }} />
			<TextField
				fullWidth
				label="Name"
				value={props.name ?? ""}
				required
				onChange={(event) => {
					const { value } = event.currentTarget;
					props.onNameChange?.(value);
				}}
			/>
			<TextField
				label="Role"
				value={props.role ?? ""}
				onChange={(event) => {
					const { value } = event.currentTarget;
					props.onRoleChange?.(value);
				}}
			/>
			<IconButton color="error" size="small" onClick={props.onDelete}>
				<Delete />
			</IconButton>
		</div>
	);
}
