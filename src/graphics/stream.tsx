import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ASMStream } from './elements/individual-stream';

const StreamContainer = styled.div``;

const Streams = ['liquidwifi', 'esl_csgo', 'xisuma', 'capcomfighters'];

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
				<Switch>{StreamElements}</Switch>
			</Router>
		</StreamContainer>
	);
};

render(<Stream />, document.getElementById('stream'));
