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
import styled from "@emotion/styled";

// Styled Components for Dark Mode
const PageWrapper = styled.div`
  background-color: #121212;
  color: #ffffff;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-weight: 500;
  color: #e0e0e0;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const ContainerBox = styled.div`
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  min-width: 300px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ContainerTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #888;
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
  width: 80px;
  height: 80px;
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
		<SquareItem ref={setNodeRef} style={style} isDragging={isDragging} {...attributes} {...listeners}>
			{id}
		</SquareItem>
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
		<ContainerBox ref={setNodeRef}>
			<ContainerTitle>{title}</ContainerTitle>
			<SortableContext items={items} strategy={horizontalListSortingStrategy}>
				<ItemList style={{ minHeight: "80px" }}>
					{items.map((itemId) => (
						<SortableItem key={itemId} id={itemId} />
					))}
				</ItemList>
			</SortableContext>
		</ContainerBox>
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
						<Container id="comm1" title="Container 1" items={items["comm1"] ?? []} />
						<Container id="host" title="Host" items={items["host"] ?? []} />
					</Row>
				</Section>

				<Section>
					<Row>
						<Container id="runners" title="Runners List" items={items["runners"] ?? []} />
					</Row>
				</Section>

				<DragOverlay>
					{activeId ? <SquareItem style={{ opacity: 1, cursor: "grabbing" }}>{activeId}</SquareItem> : null}
				</DragOverlay>
			</DndContext>
		</PageWrapper>
	);
}
