import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import styles from "./sortable-item.module.css";

interface SquareItemProps extends React.ComponentProps<"div"> {
	isDragging?: boolean;
}

export function SquareItem({ isDragging, className, ...props }: SquareItemProps) {
	return (
		<div
			{...props}
			className={clsx(styles.squareItem, isDragging && styles.dragging, className)}
		/>
	);
}

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
