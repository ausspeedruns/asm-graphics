import { X32Status } from '@asm-graphics/types/X32';
import React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const X32Container = styled.div``;

const X32Status = styled.div`
	height: 2rem;
	color: white;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

function x32StatusStyle(status: X32Status): { text: string; colour: string } {
	switch (status) {
		case 'disconnected':
			return { text: 'Disconnected', colour: '#757575' };
		case 'connected':
			return { text: 'Connected', colour: '#4CAF50' };
		case 'error':
			return { text: 'Error', colour: '#D32F2F' };
		case 'warning':
			return { text: 'Missed Heartbeat', colour: '#FF9800' };
		default:
			return { text: status, colour: '#ff008c' };
	}
}

export const X32: React.FC = () => {
	const [x32StatusRep] = useReplicant<X32Status, X32Status>('x32:status', 'disconnected');

	const x32StatusInfo = x32StatusStyle(x32StatusRep);

	return (
		<X32Container>
			<X32Status style={{ backgroundColor: x32StatusInfo.colour }}>{x32StatusInfo.text}</X32Status>
		</X32Container>
	);
};

createRoot(document.getElementById('root')!).render(<X32 />);
