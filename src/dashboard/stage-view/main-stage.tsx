import React, { useEffect, useState, useContext } from "react";
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
import clsx from "clsx";
import { useReplicant } from "@nodecg/react-hooks";
import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData";
import CircularProgress from "@mui/material/CircularProgress";
import { SortablePerson, Person } from "./person";
import { Button } from "@mui/material";
import { PersonDataContext } from "./use-person-data";
import styles from "./main-stage.module.css";

// Droppable Container Component
interface ContainerProps {
	id: string;
	title: string;
	items: string[];
	isRunnerSection?: boolean;
	openPersonEditDialog?: (personId: string) => void;
	setTalkbackIds?: (ids: string[]) => void;
	currentTalkbackTargets?: string[];
	newPerson?: () => void;
}

function Container({
	id,
	title,
	items,
	isRunnerSection,
	openPersonEditDialog,
	setTalkbackIds,
	currentTalkbackTargets,
	newPerson,
}: ContainerProps) {
	const { setNodeRef } = useDroppable({ id });

	return (
		<div className={styles.containerBox} ref={setNodeRef}>
			<h3 className={styles.containerTitle}>{title}</h3>
			<SortableContext items={items} strategy={horizontalListSortingStrategy}>
				<div className={styles.itemList} style={{ minHeight: "120px" }}>
					{items.map((itemId) => (
						// <SortableItem key={item.id} person={item} />
						<SortablePerson
							key={itemId}
							id={itemId}
							isInRunnerSection={isRunnerSection}
							handleEditPerson={openPersonEditDialog}
							updateTalkbackTargets={setTalkbackIds}
							currentTalkbackTargets={currentTalkbackTargets}
						/>
					))}
					<Button onClick={newPerson}>+</Button>
				</div>
			</SortableContext>
		</div>
	);
}

type ItemsState = Record<string, string[]>;

interface MainStageProps {
	openPersonEditDialog: (personId: string) => void;
	currentTalkbackIds?: string[]; // TODO: Convert this stuff to a context provider
	setTalkbackIds?: (ids: string[]) => void;
	createNewPerson?: (isRunner: boolean) => void;
}

// Main Component
export function MainStage(props: MainStageProps) {
	const personDataContext = useContext(PersonDataContext);
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
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
		void nodecg.sendMessage("commentators:reorder", newOrder);
	};

	const onRunnersReordered = (newOrder: string[]) => {
		// TODO: Update systems when runners are reordered
		console.log("Runners reordered:", newOrder);

		if (!runDataActiveRep) return;

		void nodecg.sendMessage("speedcontrol:reorderRunners", {
			runId: runDataActiveRep.id,
			newOrder: newOrder,
		});
	};

	// ================================================================================

	useEffect(() => {
		if (!personDataContext) return;
		
		const newItems: ItemsState = {
			commentators: personDataContext.commentators.map((c) => c.id),
			runners: personDataContext.runners.map((p) => p.id),
		};
		setItems(newItems);
		// setInitialised(true);
	}, [personDataContext?.commentators, personDataContext?.runners]);

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
		<div className={styles.pageWrapper}>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<div className={styles.section}>
					<div className={styles.row}>
						<Container
							id="commentators"
							title="Commentators"
							items={items["commentators"] ?? []}
							openPersonEditDialog={props.openPersonEditDialog}
							setTalkbackIds={props.setTalkbackIds}
							currentTalkbackTargets={props.currentTalkbackIds}
							newPerson={() => props.createNewPerson?.(false)}
						/>
					</div>
				</div>

				<div className={styles.section}>
					<div className={styles.row}>
						<Container
							id="runners"
							title="Runners"
							items={items["runners"] ?? []}
							isRunnerSection
							openPersonEditDialog={props.openPersonEditDialog}
							setTalkbackIds={props.setTalkbackIds}
							currentTalkbackTargets={props.currentTalkbackIds}
							newPerson={() => props.createNewPerson?.(true)}
						/>
					</div>
				</div>

				<DragOverlay>
					{activeId ? <Person style={{ opacity: 1, cursor: "grabbing" }} id={activeId} /> : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
