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
} from "@dnd-kit/core";
import {
	arrayMove,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import styled from "@emotion/styled";
import { Container } from "./container";
import { SquareItem } from "./sortable-item";

const PageWrapper = styled.div`
  background-color: #121212;
  color: #ffffff;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Section = styled.div`
  margin-bottom: 40px;
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

interface ItemsState {
  [key: string]: string[];
}

export default function MultipleContainers() {
	const [items, setItems] = useState<ItemsState>({
		comm1: ["C1-1", "C1-2", "C1-3"],
		comm2: ["C2-1", "C2sdsad-2"],
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
					<SectionTitle>Commentators</SectionTitle>
					<Row>
						<Container id="comm1" title="Container 1" items={items["comm1"] ?? []} />
						<Container id="comm2" title="Container 2" items={items["comm2"] ?? []} />
					</Row>
				</Section>

				<Section>
					<SectionTitle>Runners</SectionTitle>
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

