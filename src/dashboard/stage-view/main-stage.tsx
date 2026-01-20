import React, { useEffect, useState } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	DragOverlay,
	useDroppable,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	horizontalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "@emotion/styled";
import { useReplicant } from "@nodecg/react-hooks";
import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData";
import CircularProgress from "@mui/material/CircularProgress";
import { SortablePerson, Person } from "./person";

// Styled Components for Dark Mode
const PageWrapper = styled.div`
	min-width: 800px;
	width: 100%;
`;

const Section = styled.div`
	margin-bottom: 16px;
`;

const Row = styled.div`
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
`;

const ContainerBox = styled.div`
	background-color: rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	padding: 16px;
	min-width: 300px;
	min-height: 120px;
	display: flex;
	flex-direction: column;
	flex: 1;
	position: relative;
`;

const ContainerTitle = styled.h3`
	position: absolute;
	top: 8px;
	left: 16px;
	font-size: 0.9rem;
	color: #ffffff;
	text-transform: uppercase;
	letter-spacing: 1px;
`;

const ItemList = styled.div`
	display: flex;
	flex-direction: row;
	gap: 12px;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
`;

const SquareItem = styled.div<{ isDragging?: boolean }>`
	width: 170px;
	height: 200px;
	background-color: #2c2c2c;
	border: 1px solid #444;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: grab;
	user-select: none;
	transition: border-color 0.2s, box-shadow 0.2s;
	opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
	box-shadow: ${(props) => (props.isDragging ? "0 8px 20px rgba(0,0,0,0.6)" : "0 2px 4px rgba(0,0,0,0.2)")};
	
	&:hover {
		border-color: #666;
		background-color: #333;
	}

	&:active {
		cursor: grabbing;
	}
`;

// Droppable Container Component
interface ContainerProps {
	id: string;
	title: string;
	items: string[];
	isRunnerSection?: boolean;
	openPersonEditDialog?: (personId: string) => void;
}

function Container({ id, title, items, isRunnerSection, openPersonEditDialog }: ContainerProps) {
	const { setNodeRef } = useDroppable({ id });

	return (
		<ContainerBox ref={setNodeRef}>
			<ContainerTitle>{title}</ContainerTitle>
			<SortableContext items={items} strategy={horizontalListSortingStrategy}>
				<ItemList style={{ minHeight: "120px" }}>
					{items.map((itemId) => (
						// <SortableItem key={item.id} person={item} />
						<SortablePerson
							key={itemId}
							id={itemId}
							isInRunnerSection={isRunnerSection}
							handleEditPerson={openPersonEditDialog}
						/>
					))}
				</ItemList>
			</SortableContext>
		</ContainerBox>
	);
}

type ItemsState = Record<string, string[]>;

interface MainStageProps {
	openPersonEditDialog: (personId: string) => void;
}

// Main Component
export function MultipleContainers(props: MainStageProps) {
	const [commentators] = useReplicant("commentators");
	const [runDataActive] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [initialised, setInitialised] = useState(false);

	const [items, setItems] = useState<ItemsState>({
		commentators: [],
		host: [],
		runners: [],
	});

	const [activeId, setActiveId] = useState<string | null>(null);

	// ===== STUBS: Called when drag operations complete and systems need updating =====

	const onRunnerMovedToCommentators = (runnerId: string, newIndex: number) => {
		// TODO: Update systems when a runner is moved into the commentators box
		console.log(`Runner ${runnerId} moved to commentators at index ${newIndex}`);
		void nodecg.sendMessage("commentators:runnerToCommentator", {
			runnerId: runnerId,
			positionIndex: newIndex,
		});
	};

	const onCommentatorMovedToRunners = (commentatorId: string, newIndex: number) => {
		// TODO: Update systems when a commentator is moved into the runners box
		console.log(`Commentator ${commentatorId} moved to runners at index ${newIndex}`);
		void nodecg.sendMessage("speedcontrol:commentatorToRunner", {
			commentatorId: commentatorId,
			teamIndex: 0, // For simplicity, always add to team 0 (for now)
			positionIndex: newIndex,
		});
	};

	const onCommentatorsReordered = (newOrder: string[]) => {
		// TODO: Update systems when commentators are reordered
		console.log("Commentators reordered:", newOrder);
		nodecg.sendMessage("commentators:reorder", newOrder);
	};

	const onRunnersReordered = (newOrder: string[]) => {
		// TODO: Update systems when runners are reordered
		console.log("Runners reordered:", newOrder);

		if (!runDataActive) return;

		nodecg.sendMessage("speedcontrol:reorderRunners", {
			runId: runDataActive.id,
			newOrder: newOrder,
		});
	};

	// ================================================================================

	useEffect(() => {
		if (initialised || !runDataActive || !commentators) return;

		const newItems: ItemsState = {
			commentators: commentators.map((c) => c.id),
			runners: runDataActive.teams.flatMap((team) => team.players.map((p) => p.id)),
		};
		setItems(newItems);
		setInitialised(true);
	}, [commentators, runDataActive, initialised]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const findContainer = (id: string): string | undefined => {
		if (id in items) return id;
		return Object.keys(items).find((key) => items[key]?.includes(id));
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		const overId = over?.id;

		if (!overId) return;

		const activeContainer = findContainer(active.id as string);
		const overContainer = findContainer(overId as string);

		if (!activeContainer || !overContainer || activeContainer === overContainer) {
			return;
		}

		setItems((prev) => {
			const activeItems = prev[activeContainer] ?? [];
			const overItems = prev[overContainer] ?? [];

			const activeIndex = activeItems.indexOf(active.id as string);
			const overIndex = overItems.indexOf(overId as string);

			let newIndex: number;
			if (overId in prev) {
				newIndex = overItems.length;
			} else {
				const isBelowLastItem = over && overIndex === overItems.length - 1;
				const modifier = isBelowLastItem ? 1 : 0;
				newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
			}

			const itemToMove = activeItems[activeIndex];
			if (itemToMove === undefined) return prev;

			return {
				...prev,
				[activeContainer]: activeItems.filter((item) => item !== active.id),
				[overContainer]: [...overItems.slice(0, newIndex), itemToMove, ...overItems.slice(newIndex)],
			};
		});
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		const activeContainer = findContainer(active.id as string);
		const overContainer = findContainer(over?.id as string);

		if (!activeContainer || !overContainer) {
			setActiveId(null);
			return;
		}

		console.log(`Drag ended. Active: ${active.id} in ${activeContainer}, Over: ${over?.id} in ${overContainer}`);

		// Same container reorder
		const activeIndex = items[activeContainer]?.indexOf(active.id as string) ?? -1;
		const overIndex = items[overContainer]?.indexOf(over?.id as string) ?? -1;

		if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
			setItems((prev) => {
				const containerItems = prev[overContainer];
				if (!containerItems) return prev;
				const newOrder = arrayMove(containerItems, activeIndex, overIndex);

				// Call the appropriate reorder stub
				if (overContainer === "commentators") {
					onCommentatorsReordered(newOrder);
				} else if (overContainer === "runners") {
					onRunnersReordered(newOrder);
				}

				return {
					...prev,
					[overContainer]: newOrder,
				};
			});
		}

		setActiveId(null);
	};

	if (!initialised) {
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
			<CircularProgress />
		</div>;
	}

	return (
		<PageWrapper>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<Section>
					<Row>
						<Container
							id="commentators"
							title="Commentators"
							items={items["commentators"] ?? []}
							openPersonEditDialog={props.openPersonEditDialog}
						/>
					</Row>
				</Section>

				<Section>
					<Row>
						<Container
							id="runners"
							title="Runners"
							items={items["runners"] ?? []}
							isRunnerSection
							openPersonEditDialog={props.openPersonEditDialog}
						/>
					</Row>
				</Section>

				<DragOverlay>
					{activeId ? <Person style={{ opacity: 1, cursor: "grabbing" }} id={activeId} /> : null}
				</DragOverlay>
			</DndContext>
		</PageWrapper>
	);
}
