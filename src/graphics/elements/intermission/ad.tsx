import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";

import adEntry from "../../media/ASM23/ad_ENTRY.webm";
import adExit from "../../media/ASM23/ad_EXIT.webm";

const IntermissionAdsContainer = styled.div`
	width: 720px;
	display: flex;
	flex-direction: column;
	/* opacity: 0; */
	/* background: linear-gradient(90deg, #7f6314 0%, #000000 33.33%, #000000 66.67%, #7f6314 100%); */
	/* border-top: 1px solid var(--sec);
	border-bottom: 1px solid var(--sec); */
	height: 439px;
`;

const VideoBox = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	top: 0;
	width: 100%;
	height: 100%;
`;

const Video = styled.video`
	width: 640px;
	height: auto;
	z-index: 2;
	opacity: 0;
`;

const EntryExitVids = styled.video`
	opacity: 0;
	position: absolute;
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
	const entryRef = useRef<HTMLVideoElement>(null);
	const exitRef = useRef<HTMLVideoElement>(null);

	useImperativeHandle(ref, () => ({
		showAd(ad) {
			let adData = {
				src: "",
				length: 0,
				volume: 0,
			};

			console.log(ad);
			switch (ad) {
				case "Elgato_GreenScreen":
					adData = {
						src: "../shared/sponsors/Green_Screen.mp4",
						length: 30,
						volume: 0.8,
					};
					break;
				case "Elgato_KeyLight":
					adData = {
						src: "../shared/sponsors/Key_Light.mp4",
						length: 45,
						volume: 0.8,
					};
					break;
				case "Elgato_WaveDX":
					adData = {
						src: "../shared/sponsors/Wave_DX.mp4",
						length: 20,
						volume: 0.8,
					};
					break;
				case "Elgato_WaveMicArm":
					adData = {
						src: "../shared/sponsors/Wave_Mic_Arm.mp4",
						length: 53,
						volume: 0.8,
					};
					break;
				case "GOC":
					adData = {
						src: "../shared/sponsors/GameOnCancer.mp4",
						length: 43,
						volume: 1,
					};
					break;
				default:
					return;
			}

			if (adData.src === "") return;

			const tl = gsap.timeline();

			// Prepare ad contents
			tl.call(() => {
				if (!videoRef.current) return;
				videoRef.current.volume = adData.volume;
				videoRef.current.src = adData.src;
			});

			// Run entry
			tl.call(() => {
				if (!entryRef.current) return;
				entryRef.current?.play();
			});

			// Prepare entry vid
			tl.set(entryRef.current, { opacity: 1 });

			// Wait for entry finish and then fade ad in
			tl.to(videoRef.current, { opacity: 1 }, "+=2");

			// Run ad
			tl.call(() => {
				if (!videoRef.current) return;
				videoRef.current?.play();
			});

			// Fade out ad
			tl.to(videoRef.current, { opacity: 0 }, `+=${adData.length + 1}`);

			// Swap from entry to exit
			tl.set(entryRef.current, { opacity: 0 });
			tl.set(exitRef.current, { opacity: 1 });

			// Run exit
			tl.call(() => {
				if (!exitRef.current) return;
				exitRef.current?.play();
			});

			tl.set(exitRef.current, { opacity: 0 });
		},
	}));

	return (
		<IntermissionAdsContainer className={props.className} style={props.style} ref={containerRef}>
			<EntryExitVids ref={entryRef} src={adEntry} muted />
			<VideoBox>
				<Video ref={videoRef} />
			</VideoBox>
			<EntryExitVids ref={exitRef} src={adExit} muted />
		</IntermissionAdsContainer>
	);
});

IntermissionAds.displayName = "IntermissionAds";
