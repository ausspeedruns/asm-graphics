import { useState } from "react";
import styled from "styled-components";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverlay,
	type DragEndEvent,
	type DragOverEvent,
	useDroppable,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ============================================
// STYLED COMPONENTS (Visual styling only)
// ============================================

// Main wrapper with padding
const Wrapper = styled.div`
	padding: 20px;
`;

// Horizontal row for containers
const Row = styled.div`
	display: flex;
	gap: 10px;
	margin-bottom: 10px;
`;

// Drop zone container - changes appearance when item is dragged over it
const ContainerBox = styled.div<{ $isActive: boolean }>`
	background: ${({ $isActive }) => ($isActive ? "#3d4a5c" : "#2e3b4e")};
	padding: 10px;
	flex: 1;
	border-radius: 8px;
	border: 2px ${({ $isActive }) => ($isActive ? "dashed #ce762f" : "solid transparent")};
	transition: all 0.2s ease;
	min-height: 140px;
	display: flex;
	flex-direction: column;
`;

// Container title
const ContainerTitle = styled.h3`
	margin: 0 0 10px 0;
	text-align: center;
`;

// Grid layout for items inside a container
const ItemsGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 5px;
	flex: 1;
`;

// Individual draggable item - fades when being dragged
const ItemBox = styled.div<{ $isDragging?: boolean }>`
	padding: 10px;
	margin: 5px;
	background-color: #232e3e;
	border: 1px solid #ddd;
	border-radius: 4px;
	cursor: grab;
	width: 100px;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
`;

// The floating item that follows your cursor while dragging
const DragItem = styled.div`
	padding: 10px;
	background-color: #ce762f;
	border: 1px solid #ddd;
	border-radius: 4px;
	width: 100px;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

// Placeholder text for empty containers
const EmptyText = styled.div`
	color: #999;
	padding: 20px;
	text-align: center;
`;

// ============================================
// SORTABLE ITEM COMPONENT
// A single draggable item that can be reordered
// ============================================

function SortableItem({ id }: { id: string }) {
	// useSortable gives us everything needed to make an item draggable
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	return (
		<ItemBox
			ref={setNodeRef} // Required: tells dnd-kit which element to track
			$isDragging={isDragging}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			{...attributes} // Required: accessibility attributes
			{...listeners} // Required: mouse/touch event handlers
		>
			Item {id}
		</ItemBox>
	);
}

// ============================================
// CONTAINER COMPONENT
// A drop zone that holds multiple items
// ============================================

function Container({ id, items, isActive }: { id: string; items: string[]; isActive: boolean }) {
	// useDroppable makes this a valid drop target
	const { setNodeRef } = useDroppable({ id });

	return (
		<ContainerBox ref={setNodeRef} $isActive={isActive}>
			<ContainerTitle>{id}</ContainerTitle>
			{/* SortableContext tells dnd-kit which items belong to this container */}
			<SortableContext id={id} items={items}>
				<ItemsGrid>
					{items.map((itemId) => (
						<SortableItem key={itemId} id={itemId} />
					))}
					{items.length === 0 && <EmptyText>Drop item here</EmptyText>}
				</ItemsGrid>
			</SortableContext>
		</ContainerBox>
	);
}

// ============================================
// MAIN COMPONENT
// Manages all the drag and drop logic
// ============================================

export default function MultipleContainers() {
	// ---- STATE ----
	// All items organized by which container they're in
	const [items, setItems] = useState<Record<string, string[]>>({
		Commentators: ["1", "2", "3"],
		Host: ["4"],
		Runners: ["5", "6"],
	});

	// Which item is currently being dragged (null if none)
	const [activeId, setActiveId] = useState<string | null>(null);

	// Which container is being hovered over (for visual feedback)
	const [hoveredContainer, setHoveredContainer] = useState<string | null>(null);

	// ---- SENSORS ----
	// Sensors detect drag gestures (mouse clicks, touch, etc.)
	const sensors = useSensors(useSensor(PointerSensor));

	// ---- HELPER FUNCTION ----
	// Given an item ID (or container ID), find which container it belongs to
	const findContainer = (id: string) => {
		// If the ID is a container name, return it directly
		if (id in items) return id;
		// Otherwise, search through all containers to find which one has this item
		return Object.keys(items).find((key) => items[key]?.includes(id));
	};

	// ---- DRAG HANDLERS ----

	// Called continuously while dragging - updates visual hover feedback
	const handleDragOver = (event: DragOverEvent) => {
		const overId = event.over?.id;
		if (overId) {
			setHoveredContainer(findContainer(overId as string) ?? null);
		}
	};

	// Called when you release the dragged item - handles the actual move
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		// Reset visual state
		setActiveId(null);
		setHoveredContainer(null);

		// If not dropped on anything, do nothing
		if (!over?.id) return;

		// Figure out which containers are involved
		const activeContainer = findContainer(active.id as string);
		const overContainer = findContainer(over.id as string);

		if (!activeContainer || !overContainer) return;

		// Update the items state
		setItems((prev) => {
			const activeItems = [...(prev[activeContainer] ?? [])];
			const activeId = active.id as string;
			const activeIndex = activeItems.indexOf(activeId);

			// CASE 1: Moving to a DIFFERENT container
			if (activeContainer !== overContainer) {
				const overItems = [...(prev[overContainer] ?? [])];

				// Special case: Host can only hold 1 item
				// If Host already has an item, move it to Commentators
				if (overContainer === "Host" && overItems.length > 0) {
					return {
						...prev,
						[activeContainer]: activeItems.filter((i) => i !== activeId),
						Host: [activeId],
						Commentators: prev.Commentators
							? [...prev.Commentators.filter((i) => i !== activeId), overItems[0] as string]
							: [],
					};
				}

				// Normal case: just add to the new container
				return {
					...prev,
					[activeContainer]: activeItems.filter((i) => i !== activeId),
					[overContainer]: [...overItems, activeId],
				};
			}

			// CASE 2: Reordering within the SAME container
			const overIndex = activeItems.indexOf(over.id as string);
			if (overIndex >= 0 && activeIndex !== overIndex) {
				// arrayMove is a helper that reorders an array
				return { ...prev, [overContainer]: arrayMove(activeItems, activeIndex, overIndex) };
			}

			return prev;
		});
	};

	return (
		<Wrapper>
			{/* DndContext is the main wrapper that enables drag and drop */}
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter} // How to detect what you're hovering over
				onDragStart={(e) => setActiveId(e.active.id as string)} // When drag starts
				onDragOver={handleDragOver} // While dragging (updates hover state)
				onDragEnd={handleDragEnd} // When you release (moves the item)
				onDragCancel={() => {
					// If drag is cancelled (e.g., pressing Escape)
					setActiveId(null);
					setHoveredContainer(null);
				}}
			>
				<Row>
					<Container
						id="Commentators"
						items={items.Commentators ?? []}
						isActive={activeId !== null && hoveredContainer === "Commentators"}
					/>
					<Container
						id="Host"
						items={items.Host ?? []}
						isActive={activeId !== null && hoveredContainer === "Host"}
					/>
				</Row>

				<Row>
					<Container
						id="Runners"
						items={items.Runners ?? []}
						isActive={activeId !== null && hoveredContainer === "Runners"}
					/>
				</Row>

				{/* DragOverlay: The floating preview that follows your cursor while dragging */}
				<DragOverlay>{activeId && <DragItem>Item {activeId}</DragItem>}</DragOverlay>
			</DndContext>
		</Wrapper>
	);
}
