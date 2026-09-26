import React, { useState } from "react";
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
import styles from "./dnd-test.module.css";

// Sortable Item Component
interface SortableItemProps {
	id: string;
}

const SortableItem: React.FC<SortableItemProps> = ({ id }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={clsx(styles.squareItem, isDragging && styles.dragging)}
			{...attributes}
			{...listeners}
		>
			{id}
		</div>
	);
};

// Droppable Container Component
interface ContainerProps {
	id: string;
	title: string;
	items: string[];
}

const Container: React.FC<ContainerProps> = ({ id, title, items }) => {
	const { setNodeRef } = useDroppable({ id });

	return (
		<div className={styles.containerBox} ref={setNodeRef}>
			<h3 className={styles.containerTitle}>{title}</h3>
			<SortableContext items={items} strategy={horizontalListSortingStrategy}>
				<div className={styles.itemList} style={{ minHeight: "80px" }}>
					{items.map((itemId) => (
						<SortableItem key={itemId} id={itemId} />
					))}
				</div>
			</SortableContext>
		</div>
	);
};

type ItemsState = Record<string, string[]>;

// Main Component
export default function MultipleContainers() {
	const [items, setItems] = useState<ItemsState>({
		comm1: ["C1-1", "C1-2", "C1-3"],
		host: ["C2-1", "C2-2"],
		runners: ["R1", "R2", "R3", "R4"],
	});

	const [activeId, setActiveId] = useState<string | null>(null);

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

		if (!activeContainer || !overContainer || activeContainer !== overContainer) {
			setActiveId(null);
			return;
		}

		const activeIndex = items[activeContainer]?.indexOf(active.id as string) ?? -1;
		const overIndex = items[overContainer]?.indexOf(over?.id as string) ?? -1;

		if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
			setItems((prev) => {
				const containerItems = prev[overContainer];
				if (!containerItems) return prev;
				return {
					...prev,
					[overContainer]: arrayMove(containerItems, activeIndex, overIndex),
				};
			});
		}

		setActiveId(null);
	};

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
						<Container id="comm1" title="Container 1" items={items["comm1"] ?? []} />
						<Container id="host" title="Host" items={items["host"] ?? []} />
					</div>
				</div>

				<div className={styles.section}>
					<div className={styles.row}>
						<Container id="runners" title="Runners List" items={items["runners"] ?? []} />
					</div>
				</div>

				<DragOverlay>
					{activeId ? (
						<div className={styles.squareItem} style={{ opacity: 1, cursor: "grabbing" }}>
							{activeId}
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
