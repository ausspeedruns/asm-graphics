import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import styled from "@emotion/styled";
import { SortableItem } from "./sortable-item";

const ContainerBox = styled.div`
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
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

interface ContainerProps {
	id: string;
	title: string;
	items: string[];
}

export function Container({ id, title, items }: ContainerProps) {
	const { setNodeRef } = useDroppable({ id });

	return (
		<ContainerBox ref={setNodeRef}>
			<ContainerTitle>{title}</ContainerTitle>
			<SortableContext items={items} strategy={horizontalListSortingStrategy}>
				<ItemList style={{ minHeight: "80px", flex: 1 }}>
					{items.map((itemId) => (
						<SortableItem key={itemId} id={itemId} />
					))}
				</ItemList>
			</SortableContext>
		</ContainerBox>
	);
}
