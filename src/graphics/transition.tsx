import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';
import { useListenFor } from 'use-nodecg';
import gsap from 'gsap';

// import ASMLogo from './media/ASM2022 Logo.svg';
// import BGIMG from './media/pixel/Transition/BG.png';
// import StartWipeIMG from './media/pixel/Transition/StartWipe.png';
// import EndWipeIMG from './media/pixel/Transition/EndWipe.png';

import Clip1 from './media/audio/chestappears1.mp3';
import Clip2 from './media/audio/crystal.mp3';
import Clip3 from './media/audio/heartcontainer1.mp3';
import Clip4 from './media/audio/heartpiece1.mp3';
import Clip5 from './media/audio/itemget1.mp3';

const ClipArray = [
	Clip1,
	Clip2,
	Clip3,
	Clip4,
	Clip5
];

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
	const audioRef = useRef<HTMLAudioElement>(null);
	useListenFor('runTransitionGraphic', () => {
		console.log('Transitioning');

		runTransition();
	});

	function runTransition() {
		console.log('Running');
		const tl = gsap.timeline();
		tl.call(() => {
			if (!audioRef.current) return;

			audioRef.current.src = ClipArray[Math.floor(Math.random()*ClipArray.length)];
			audioRef.current.play();
		}, [], '+=1.2')
	}

	const changeBGColor = (col: string) => {
		document.body.style.background = col;
	};

	return (
		<TransitionContainer>
			<TransitionDiv>
			</TransitionDiv>
			<audio ref={audioRef} />
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

createRoot(document.getElementById('root')!).render(<Transition />);
