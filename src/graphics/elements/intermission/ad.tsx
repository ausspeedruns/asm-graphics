import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

import BackgroundImage from '../../media/pixel/IntermissionAdBG.png';

import GameOnCancerVid from '../../media/Sponsors/GameOnCancer.mp4';
import HyperXVid from '../../media/Sponsors/HyperX.mp4';

const IntermissionAdsContainer = styled.div`
	width: 955px;
	display: flex;
	flex-direction: column;
	opacity: 0;
`;

const VideoBox = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	top: 0;
	width: 100%;
	height: 458px;
`;

const Video = styled.video`
	width: 720px;
	height: auto;
	z-index: 2;
	opacity: 0;
`;

const OrangeBlock = styled.div`
	width: 100%;
	background-color: var(--sec);
`;

const BGImage = styled.img`
	z-index: 1;
`;

const BlueBlock = styled.div`
	background-color: var(--main-dark);
	height: 300px;
	margin-top: -43px;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export interface IntermissionAdsRef {
	showAd: (ad: string) => void;
}

export const IntermissionAds = forwardRef<IntermissionAdsRef, Props>((props, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const orangeRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	useImperativeHandle(ref, () => ({
		showAd(ad) {
			let adData = {
				src: '',
				length: 0,
				volume: 0,
			};

			switch (ad) {
				case 'HyperX':
					adData = {
						src: HyperXVid,
						length: 30,
						volume: 0.8,
					};
					break;

				case 'GOC':
					adData = {
						src: GameOnCancerVid,
						length: 43,
						volume: 1,
					};
					break;
				default:
					return;
			}

			if (adData.src === '') return;

			const tl = gsap.timeline();

			tl.to(containerRef.current, { opacity: 1, duration: 2 });
			tl.to(orangeRef.current, { height: 234, duration: 2 });
			tl.to(videoRef.current, { opacity: 1 });
			tl.call(() => {
				if (!videoRef.current) return;
				videoRef.current.volume = adData.volume;
				videoRef.current.src = adData.src;
				videoRef.current?.play();
			});
			tl.to(videoRef.current, { opacity: 0 }, `+=${adData.length + 1}`);
			tl.to(orangeRef.current, { height: 0 });
			tl.to(containerRef.current, { opacity: 0 });
		},
	}));

	return (
		<IntermissionAdsContainer className={props.className} style={props.style} ref={containerRef}>
			<VideoBox>
				<Video src={GameOnCancerVid} ref={videoRef} />
			</VideoBox>
			<OrangeBlock ref={orangeRef} />
			<BGImage src={BackgroundImage} />
			<BlueBlock />
		</IntermissionAdsContainer>
	);
});
