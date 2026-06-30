import { ArrowUpward, ArrowDownward, Delete, Add } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import { useRef } from "react";
import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Name } from "./name";
import type { CreditsName } from "@asm-graphics/shared/credits";

interface SectionProps {
	title?: string;
	names?: CreditsName[];
	onTitleChange?: (title: string) => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	onDelete?: () => void;
	onAddName?: () => void;
	onNameChange?: (nameIndex: number, field: keyof CreditsName, value: string) => void;
	onDeleteName?: (nameIndex: number) => void;
	onMoveName?: (activeIndex: number, overIndex: number) => void;
}

export function Section(props: SectionProps) {
	const nameIdsRef = useRef(new WeakMap<CreditsName, UniqueIdentifier>());
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);
	const nameIds =
		props.names?.map((name) => {
			const existingId = nameIdsRef.current.get(name);

			if (existingId) return existingId;

			const newId = crypto.randomUUID();
			nameIdsRef.current.set(name, newId);
			return newId;
		}) ?? [];

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const activeIndex = nameIds.findIndex((id) => id === active.id);
		const overIndex = nameIds.findIndex((id) => id === over.id);

		if (activeIndex === -1 || overIndex === -1) return;

		props.onMoveName?.(activeIndex, overIndex);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "8px",
				border: "1px solid #ffffff93",
				padding: "8px",
				borderRadius: "4px",
			}}
		>
			<TextField
				label="Section"
				fullWidth
				value={props.title ?? ""}
				onChange={(event) => {
					const { value } = event.currentTarget;
					props.onTitleChange?.(value);
				}}
			/>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "8px",
					width: "100%",
				}}
			>
				<Button fullWidth startIcon={<ArrowUpward />} onClick={props.onMoveUp}>
					Move Up
				</Button>
				<Button fullWidth startIcon={<ArrowDownward />} onClick={props.onMoveDown}>
					Move Down
				</Button>
				<Button fullWidth>Sort Names</Button>
				<IconButton color="error" size="small" onClick={props.onDelete}>
					<Delete />
				</IconButton>
			</div>
			<DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
				<SortableContext items={nameIds} strategy={verticalListSortingStrategy}>
					<div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
						{props.names?.map((name, index) => (
							<Name
								key={String(nameIds[index])}
								id={nameIds[index]!}
								name={name.name}
								role={name.role}
								onNameChange={(value) => props.onNameChange?.(index, "name", value)}
								onRoleChange={(value) => props.onNameChange?.(index, "role", value)}
								onDelete={() => props.onDeleteName?.(index)}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
			<Button color="success" fullWidth startIcon={<Add />} onClick={props.onAddName}>
				Add Name
			</Button>
		</div>
	);
}
