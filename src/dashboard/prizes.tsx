import { createRoot } from "react-dom/client";
import styled from "styled-components";
import {
	TextField,
	Typography,
	Box,
	ThemeProvider,
	Button,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	AccordionActions,
	IconButton,
} from "@mui/material";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";
import { useState } from "react";
import { DragHandle, Edit } from "@mui/icons-material";
import { CSS } from "@dnd-kit/utilities";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
	sortableKeyboardCoordinates,
	arrayMove,
} from "@dnd-kit/sortable";
import type { Prize } from "@asm-graphics/types/Prizes";

const PrizesDashboardContainer = styled.div``;

export const PrizesDashboard = () => {
	const [prizesRep] = useReplicant<Prize[]>("prizes");

	const [accordionExpanded, setAccordionExpanded] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [item, setItem] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [requirement, setRequirement] = useState("$");
	const [requirementSubheading, setRequirementSubheading] = useState("");
	const [subItem, setSubItem] = useState("");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function resetForm() {
		setEditingId(null);
		setItem("");
		setQuantity(1);
		setRequirement("$");
		setRequirementSubheading("");
		setSubItem("");
	}

	function addPrize() {
		if (!item) return;

		const newPrize: Prize = {
			id: crypto.randomUUID(),
			item,
			requirement,
			requirementSubheading,
			quantity,
			subItem,
		};

		nodecg.sendMessage("prizes:NewPrize", newPrize);

		resetForm();
	}

	function editPrize() {
		if (!editingId || !item) return;

		const editedPrize: Prize = {
			id: editingId,
			item,
			requirement,
			requirementSubheading,
			quantity,
			subItem,
		};

		nodecg.sendMessage("prizes:UpdatePrize", editedPrize);

		resetForm();
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			if (!prizesRep) return;

			const oldIndex = prizesRep.findIndex((prize) => prize.id === active.id);
			const newIndex = prizesRep.findIndex((prize) => prize.id === over?.id);

			const newOrder = arrayMove(prizesRep, oldIndex, newIndex);

			nodecg.sendMessage("prizes:ReorderPrizes", newOrder);
		}
	}

	function handleEditPrize(prize: Prize) {
		setAccordionExpanded(true);
		setEditingId(prize.id);
		setItem(prize.item);
		setQuantity(prize.quantity ?? 1);
		setRequirement(prize.requirement);
		setRequirementSubheading(prize.requirementSubheading ?? "");
		setSubItem(prize.subItem ?? "");
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<PrizesDashboardContainer>
				<Accordion expanded={accordionExpanded} onChange={() => setAccordionExpanded(!accordionExpanded)}>
					<AccordionSummary>{editingId ? "Edit" : "Add"} Prize</AccordionSummary>
					<AccordionDetails>
						{editingId && (
							<Typography
								variant="caption"
								color="text.secondary"
								marginBottom={2}
								display="inline-block">
								Editing {editingId}
							</Typography>
						)}
						<Box display="flex" gap={2} marginBottom={2}>
							<TextField
								label="Quantity"
								type="number"
								variant="outlined"
								value={quantity}
								onChange={(e) => setQuantity(Number(e.target.value))}
								required
							/>
							<TextField
								label="Item"
								variant="outlined"
								fullWidth
								value={item}
								onChange={(e) => setItem(e.target.value)}
								required
							/>
						</Box>
						<Box display="flex" gap={2}>
							<TextField
								label="Requirement"
								variant="outlined"
								helperText="E.g. $10"
								value={requirement}
								onChange={(e) => setRequirement(e.target.value)}
								required
							/>
							<TextField
								label="Requirement Subheading"
								variant="outlined"
								fullWidth
								helperText='E.g. "Min Dono"'
								value={requirementSubheading}
								onChange={(e) => setRequirementSubheading(e.target.value)}
							/>
						</Box>
						<TextField
							label="Sub Item"
							variant="outlined"
							fullWidth
							margin="normal"
							helperText='E.g. "Game Code"'
							value={subItem}
							onChange={(e) => setSubItem(e.target.value)}
						/>
					</AccordionDetails>
					<AccordionActions>
						<Button
							fullWidth
							color="success"
							variant="contained"
							onClick={editingId ? editPrize : addPrize}>
							{editingId ? "Edit" : "Add"} Prize
						</Button>
					</AccordionActions>
				</Accordion>

				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={prizesRep ?? []} strategy={verticalListSortingStrategy}>
						{prizesRep?.map((prize) => (
							<PrizeElement key={prize.id} prize={prize} beginEdit={handleEditPrize} />
						))}
					</SortableContext>
				</DndContext>
			</PrizesDashboardContainer>
		</ThemeProvider>
	);
};

type PrizeProps = {
	prize: Prize;
	beginEdit?: (prize: Prize) => void;
};

function PrizeElement(props: PrizeProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.prize.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			padding={2}
			margin={2}
			gap={1}
			style={style}
			backgroundColor="#4b5f7e"
			borderRadius={2}
			ref={setNodeRef}>
			<Typography variant="caption" color="text.secondary">
				{props.prize.id}
			</Typography>
			<Box display="flex" flexDirection="row" alignItems="center" gap={2}>
				<IconButton {...listeners} {...attributes}>
					<DragHandle />
				</IconButton>
				<Typography variant="h6" fontWeight="bold">
					{props.prize.quantity && `${props.prize.quantity}x`} {props.prize.item}
				</Typography>
				{props.prize.subItem && (
					<Typography variant="subtitle1" color="text.secondary">
						{props.prize.subItem}
					</Typography>
				)}
				<Typography variant="body1">
					Requirement: {props.prize.requirement}{" "}
					{props.prize.requirementSubheading && `(${props.prize.requirementSubheading})`}
				</Typography>
				<IconButton onClick={() => props.beginEdit?.(props.prize)}>
					<Edit />
				</IconButton>
			</Box>
		</Box>
	);
}

createRoot(document.getElementById("root")!).render(<PrizesDashboard />);
