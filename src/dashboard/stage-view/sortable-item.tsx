import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "@emotion/styled";

export const SquareItem = styled.div<{ isDragging?: boolean }>`
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

interface SortableItemProps {
	id: string;
}

export function SortableItem({ id }: SortableItemProps) {
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
}
