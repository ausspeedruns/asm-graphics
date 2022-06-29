import React from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';

import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ASMStream } from './elements/individual-stream';

const StreamContainer = styled.div``;

const Streams = ['asm_station1', 'asm_station2', 'asm_station3', 'asm_station4'];

export const Stream: React.FC = () => {
	const StreamElements = Streams.map((stream) => {
		return (
			<Route path={`/${stream}`} key={stream}>
				<ASMStream channel={stream} size="whole" />
			</Route>
		);
	});

	return (
		<StreamContainer>
			<Router>
				<Routes>{StreamElements}</Routes>
			</Router>
		</StreamContainer>
	);
};

createRoot(document.getElementById('root')!).render(<Stream />);
