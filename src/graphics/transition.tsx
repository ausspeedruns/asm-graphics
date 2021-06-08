import React, { useRef } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { useListenFor } from 'use-nodecg';
import gsap from 'gsap';

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

const RedBarTip = styled.div`
	height: 0;
	width: 0;
	border-top: 100px solid transparent;
	border-bottom: 100px solid transparent;
	border-right: 100px solid #df3422;
`;

const RedBar = styled.div`
	height: 200px;
	min-width: 1920px;
	background: linear-gradient(90deg, #df3422 0%, #7e1f15 100%);
`;

const BlueBarTip = styled.div`
	height: 0;
	width: 0;
	border-top: 100px solid transparent;
	border-bottom: 100px solid transparent;
	border-left: 100px solid #0c94de;
`;

const BlueBar = styled.div`
	height: 200px;
	min-width: 1920px;
	background: linear-gradient(-90deg, #0c94de 0%, #085d8b 100%);
`;

const TopBox = styled.div`
	height: 540px;
	position: relative;
`;

// const WhiteBG = styled.div`
// 	height: 340px;
// 	min-width: 1920px;
// 	background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%);
// `;

// // 170 * 2 * root(2)
// const AngleSize = 480.8326;
// const WhiteAngle = styled.div`
// 	min-height: ${AngleSize}px;
// 	max-height: ${AngleSize}px;
// 	min-width: ${AngleSize}px;
// 	background: linear-gradient(225deg, #ffffff 0%, #e8e8e8 50%);
// 	transform: rotate(-45deg);
// 	transform-origin: top right;
// 	position: absolute;
// `;

export const Transition: React.FC = () => {
	const redRef = useRef<HTMLDivElement>(null);
	const blueRef = useRef<HTMLDivElement>(null);
	const asLogo = useRef<HTMLImageElement>(null);
	const rfdsLogo = useRef<HTMLImageElement>(null);
	const topImgRef = useRef<HTMLImageElement>(null);
	const bottomImgRef = useRef<HTMLImageElement>(null);
	const topRef = useRef<HTMLImageElement>(null);
	const bottomRef = useRef<HTMLImageElement>(null);

	useListenFor('runTransitionGraphic', () => {
		console.log('Transitioning');

		runTransition();
	});

	function runTransition() {
		console.log('Running');

		const tl = gsap.timeline();

		tl.set([redRef.current, bottomImgRef.current], { x: 2090 });
		tl.set([blueRef.current, topImgRef.current], { x: -2090 });
		tl.set([asLogo.current, rfdsLogo.current], { x: 0 });
		tl.set(topRef.current, { y: 0 });
		tl.set(bottomRef.current, { y:0 });

		tl.addLabel('openingRibbon');
		tl.to(redRef.current, { x: -100, ease: 'power4.out', duration: 1.2 }, 'openingRibbon');
		tl.to(blueRef.current, { x: 0, ease: 'power4.out', duration: 1.2 }, 'openingRibbon');
		tl.to(asLogo.current, { x: 860, ease: 'power4.out', duration: 1.2 }, 'openingRibbon');
		tl.to(rfdsLogo.current, { x: -884, ease: 'power4.out', duration: 1.2 }, 'openingRibbon');
		tl.to(
			[topImgRef.current, bottomImgRef.current],
			{ x: 0, ease: 'power4.out', duration: 1.8 },
			'openingRibbon+=0.2',
		);
		// tl.call(tl.pause);

		tl.addLabel('closing', '+=0.5');

		tl.to(topRef.current, { y: -540, ease: 'power4.in' }, 'closing');
		tl.to(bottomRef.current, { y: 540, ease: 'power4.in' }, 'closing');
	}

	const changeBGColor = (col: string) => {
		document.body.style.background = col;
	};

	return (
		<TransitionContainer>
			<TransitionDiv>
				{/* <div style={{ display: 'flex', position: 'relative', overflow: 'hidden', width: '200%', marginLeft: -41 }}>
						<WhiteAngle />
						<WhiteBG style={{ marginLeft: AngleSize }} />
					</div> */}

				<TopBox ref={topRef}>
					<img
						ref={topImgRef}
						src={'../shared/design/TransitionTop.png'}
						style={{ position: 'absolute', top: 0, transform: 'translate(-2090px, 0)' }}
					/>
					<div ref={redRef} style={{ display: 'flex', transform: 'translate(2020px, 0)', position: 'absolute', bottom: 0 }}>
						<RedBarTip />
						<RedBar>
							<img ref={asLogo} style={{ height: '100%' }} src="../shared/design/AusSpeedrunsLogo.svg" />
						</RedBar>
					</div>
				</TopBox>

				<TopBox ref={bottomRef}>
					<div ref={blueRef} style={{ display: 'flex', transform: 'translate(-2020px, 0)' }}>
						<BlueBar style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
							<img ref={rfdsLogo} style={{ height: '70%' }} src="../shared/design/RFDSWhite.png" />
						</BlueBar>
						<BlueBarTip />
					</div>
					<img
						ref={bottomImgRef}
						src={'../shared/design/TransitionBottom.png'}
						style={{ position: 'absolute', bottom: 0, right: 0, transform: 'translate(2090px, 0)' }}
					/>
				</TopBox>
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
