import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { useListenFor } from 'use-nodecg';

const TransitionContainer = styled.div`
	width: 1920px;
`;

const TransitionDiv = styled.div`
	height: 1080px;
	width: 1920px;
	overflow: hidden;
	border-right: 5px solid black;
	border-bottom: 5px solid black;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;
`;

export const Transition: React.FC = () => {

	useListenFor('runTransitionGraphic', () => {
		console.log('Transitioning');

		runTransition();
	});

	function runTransition() {
		console.log('Running');
	}

	const changeBGColor = (col: string) => {
		document.body.style.background = col;
	};

	return (
		<TransitionContainer>
			<TransitionDiv>
			</TransitionDiv>
			<button style={{ float: 'right' }} onClick={runTransition}>
				Run transition
			</button>
			<div>
				<button onClick={() => changeBGColor('#000')}>Black</button>
				<button onClick={() => changeBGColor('#f00')}>Red</button>
				<button onClick={() => changeBGColor('#0f0')}>Green</button>
				<button onClick={() => changeBGColor('#00f')}>Blue</button>
				<button onClick={() => changeBGColor('rgba(0, 0, 0, 0)')}>Transparent</button>
			</div>
		</TransitionContainer>
	);
};

render(<Transition />, document.getElementById('transition'));
