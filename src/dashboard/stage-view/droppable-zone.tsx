import { useDroppable } from "@dnd-kit/core";
import styled from "styled-components";

const DroppableContainer = styled.div<{ isEmpty?: boolean; isHost?: boolean }>`
	display: flex;
	gap: 8px;
	border: ${({ isHost }) => (isHost ? "2px dashed white" : "none")};
	background-color: ${({ isHost, isEmpty }) =>
		isHost && isEmpty ? "rgba(255, 255, 255, 0.1)" : "transparent"};
	min-height: ${({ isHost }) => (isHost ? "150px" : "auto")};
	min-width: ${({ isHost }) => (isHost ? "150px" : "auto")};
	border-radius: 5px;
	border-color: ${({ isHost, isEmpty }) => (isHost && isEmpty ? "white" : "transparent")};
	margin-left: ${({ isHost }) => (isHost ? "48px" : "0")};
`;

interface DroppableZoneProps {
	id: string;
	children: React.ReactNode;
	isHost?: boolean;
	isEmpty?: boolean;
}

export function DroppableZone({ id, children, isHost, isEmpty }: DroppableZoneProps) {
	const { setNodeRef } = useDroppable({ id });

	return (
		<DroppableContainer ref={setNodeRef} isHost={isHost} isEmpty={isEmpty}>
			{children}
		</DroppableContainer>
	);
}
