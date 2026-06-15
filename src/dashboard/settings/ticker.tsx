import { useReplicant } from "@nodecg/react-hooks";
import { DEFAULT_TICKER_ORDER, type TickerSegment } from "../../shared/types/Ticker";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { Box, Checkbox, Chip, List, ListItem, Paper, Typography } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";

const SEGMENTS: { id: TickerSegment; label: string }[] = [
	{ id: "cta", label: "Call to Action" },
	{ id: "nextruns", label: "Next Runs" },
	{ id: "prizes", label: "Prizes" },
	{ id: "incentives", label: "Incentives" },
	{ id: "milestone", label: "Milestone" },
	{ id: "donationMatches", label: "Donation Matches" },
];

export function TickerSettings() {
	const [tickerOrder] = useReplicant("ticker:order");
	const [enabledSegments, setEnabledSegments] = useState<{ id: TickerSegment; enabled: boolean }[]>(
		tickerOrder ?? [...DEFAULT_TICKER_ORDER],
	);

	useEffect(() => {
		if (tickerOrder) {
			setEnabledSegments(tickerOrder);
		}
	}, [tickerOrder]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function handleDragEnd(event: any) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = enabledSegments.findIndex((segment) => segment.id === active.id);
			const newIndex = enabledSegments.findIndex((segment) => segment.id === over.id);

			const newOrder = arrayMove(enabledSegments, oldIndex, newIndex);
			setEnabledSegments(newOrder);
			void nodecg.sendMessage("ticker:set-order", newOrder);
		}
	}

	function toggleSegment(segmentId: TickerSegment) {
		const newEnabled = enabledSegments.map((segment) =>
			segment.id === segmentId ? { ...segment, enabled: !segment.enabled } : segment,
		);

		setEnabledSegments(newEnabled);
		void nodecg.sendMessage("ticker:set-order", newEnabled);
	}

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={enabledSegments} strategy={verticalListSortingStrategy}>
				<div className="ticker-settings">
					<Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>
						Ticker Segments
					</Typography>
					<List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
						{SEGMENTS.map((segment) => (
							<TickerSegmentItem
								key={segment.id}
								id={segment.id}
								label={segment.label}
								isEnabled={enabledSegments.find((s) => s.id === segment.id)?.enabled ?? false}
								onToggle={() => toggleSegment(segment.id)}
							/>
						))}
					</List>
				</div>
			</SortableContext>
		</DndContext>
	);
}

interface TickerSegmentItemProps {
	id: string;
	label: string;
	isEnabled: boolean;
	onToggle: () => void;
}

function TickerSegmentItem(props: TickerSegmentItemProps) {
	return (
		<ListItem disablePadding>
			<Paper
				variant="outlined"
				sx={{
					width: "100%",
					borderColor: props.isEnabled ? "success.main" : "grey.500",
					backgroundColor: props.isEnabled ? "success.50" : "grey.300",
					color: props.isEnabled ? "text.primary" : "text.secondary",
					transition: "all 150ms ease-in-out",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						px: 1.5,
						py: 1,
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<DragIndicator color="action" fontSize="small" />
						<Typography variant="body1">{props.label}</Typography>
						<Chip
							size="small"
							label={props.isEnabled ? "Enabled" : "Disabled"}
							color={props.isEnabled ? "success" : "default"}
							variant={props.isEnabled ? "filled" : "outlined"}
						/>
					</Box>

					<Checkbox
						checked={props.isEnabled}
						onChange={props.onToggle}
						slotProps={{ input: { "aria-label": `${props.label} enabled` } }}
						color="success"
					/>
				</Box>
			</Paper>
		</ListItem>
	);
}
