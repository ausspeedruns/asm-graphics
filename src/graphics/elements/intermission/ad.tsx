import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

const IntermissionAdsContainer = styled.div`
	width: 955px;
	display: flex;
	flex-direction: column;
	opacity: 0;
	background: linear-gradient(90deg, #7f6314 0%, #000000 33.33%, #000000 66.67%, #7f6314 100%);
	border-top: 1px solid var(--sec);
	border-bottom: 1px solid var(--sec);
	height: 221px;
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

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export interface IntermissionAdsRef {
	showAd: (ad: string) => void;
}

export const IntermissionAds = forwardRef<IntermissionAdsRef, Props>((props, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
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
						src: '../shared/sponsors/HyperX.mp4',
						length: 30,
						volume: 0.8,
					};
					break;

				case 'GOC':
					adData = {
						src: '../shared/sponsors/GameOnCancer.mp4',
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
			tl.to(containerRef.current, { height: 459, duration: 2 });
			tl.to(videoRef.current, { opacity: 1 });
			tl.call(() => {
				if (!videoRef.current) return;
				videoRef.current.volume = adData.volume;
				videoRef.current.src = adData.src;
				videoRef.current?.play();
			});
			tl.to(videoRef.current, { opacity: 0 }, `+=${adData.length + 1}`);
			tl.to(containerRef.current, { height: 221, duration: 2 });
			tl.to(containerRef.current, { opacity: 0 });
		},
	}));

	return (
		<IntermissionAdsContainer className={props.className} style={props.style} ref={containerRef}>
			<VideoBox>
				<Video ref={videoRef} />
			</VideoBox>
		</IntermissionAdsContainer>
	);
});
