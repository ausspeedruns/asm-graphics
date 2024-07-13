import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import styled, { keyframes } from "styled-components";
import { createRoot } from "react-dom/client";
import clone from "clone";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
import { format } from "date-fns";
import _ from "underscore";
// @ts-ignore
import Twemoji from "react-twemoji";
import { useRive } from "@rive-app/react-canvas";

import type { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Tweet as ITweet } from "@asm-graphics/types/Twitter";
import type { Commentator } from "@asm-graphics/types/OverlayProps";
import type NodeCG from "@nodecg/types";
import type { Goal, War } from "@asm-graphics/types/Incentives";

// import { InterCTA } from "./elements/intermission/cta";
import { InterIncentivesMemo } from "./elements/intermission/incentives";
// import { InterNextRunItem, EndRunItem } from "./elements/intermission/next-run-item";
import Mic from "@mui/icons-material/Mic";
import { FitText } from "./elements/fit-text";

// Assets
import MusicIconImg from "./media/icons/MusicIcon.svg";
// import { Sponsors } from "./elements/sponsors";
import { IntermissionAds, IntermissionAdsRef } from "./elements/intermission/ad";
// import AusSpeedrunsLogo from "./media/AusSpeedruns-Logo.svg";
import GoCLogo from "./media/Sponsors/GoCCCWhite.svg";

import StopwatchIcon from "./media/icons/stopwatch.svg";
import RunnerIcon from "./media/icons/runner.svg";
import ConsoleIcon from "./media/icons/console.svg";
import { LerpNum } from "./elements/ticker/lerp-num";

import ASLogo from "./media/AusSpeedruns-Logo.svg";
import { PRIZES } from "./prizes";
import { SceneIntermission } from "./elements/event-specific/asm-24/scene-intermission";
import { uiTime } from "./elements/event-specific/asm-24/colours";
import { useNormalisedTime } from "../hooks/useCurrentTime";

const IntermissionContainer = styled.div<{ time: string }>`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: var(--main-font);
	display: flex;
	color: var(--text-light);
	/* clip-path: path('M 0 0 H 1920 V 1080 H 0 V 958 H 960 V 120 H 0'); */
	--time: #${(props: { time: string }) => props.time};
`;

const HostName = styled.div`
	font-size: 50px;
	color: var(--text-light);
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-family: var(--secondary-font);
	font-weight: bold;
`;

const HostPronoun = styled.span`
	font-size: 50%;
	font-weight: 400;
	color: var(--text-light);
	text-transform: uppercase;
	margin-left: 8px;
	background: var(--time);
	height: 70%;
	padding: 0 4px;
	line-height: 28px;
	font-family: var(--main-font);
	font-weight: bold;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const MUSIC_WIDTH = 400;

const Music = styled.div`
	max-width: 33%;
	text-align: center;
	display: flex;
	align-items: center;
	font-family: var(--secondary-font);
	flex-shrink: 1;
`;

const MusicLabel = styled.div`
	/* width: ${MUSIC_WIDTH}px; */
	width: 91%;
	/* height: 100%; */
	color: var(--text-light);
	font-size: 28px;
	white-space: nowrap;
	/* margin: 0 16px; */
	position: relative;
`;

const StaticMusicText = styled.span`
	position: absolute;
	width: ${MUSIC_WIDTH}px;
	text-align: right;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

const MusicIcon = styled.img`
	height: 34px;
	width: auto;
`;

const MusicMarquee = styled.div`
	/* width: ${MUSIC_WIDTH}px; */
	width: 100%;
	margin: 0 auto;
	overflow: hidden;
	box-sizing: border-box;
	color: var(--text-light);
`;

const MarqueeKeyframes = keyframes`
	0% { transform: translate(0, 0); }
	100% { transform: translate(-100%, 0); }
`;

const MarqueeText = styled.span`
	display: inline-block;
	width: max-content;

	padding-left: 100%;
	/* show the marquee just outside the paragraph */
	will-change: transform;
	animation: ${MarqueeKeyframes} linear infinite;
`;

const RunContainer = styled.div`
	width: 100%;
	height: 340px;
	/* position: absolute; */
	/* justify-content: space-between; */
	font-size: 35px;
	/* font-family: var(--secondary-font); */
`;

const Title = styled.div`
	font-size: 50px;
	font-weight: 300;
	text-align: center;
`;

const GameName = styled(FitText)`
	/* font-weight: bold; */
	max-width: 80%;
	padding: 0 10%;
	font-size: 80px;
	line-height: 80px;
	font-family: var(--secondary-font);
	text-transform: uppercase;
	margin: 20px 0;
`;

const Category = styled(FitText)`
	font-size: 120%;
	max-width: 80%;
	padding: 0 10%;
	font-weight: bold;
`;

const PlayerInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	max-width: 100%;
`;

const TimeInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	max-width: 100%;
`;

const ConsoleInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	max-width: 100%;
`;

const TimeContainer = styled.div`
	/* position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	float: right;
	width: 553px; */
	font-size: 50px;
	min-width: 730px;
`;

const CurrentTime = styled.span`
	height: 80px;
	font-weight: bold;
	font-family: var(--mono-font);
	margin-right: 16px;
`;

const CurrentDate = styled.span`
	/* font-size: 32px; */
`;

const DonationContainer = styled.div`
	display: flex;
	position: absolute;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 98.5%;
	width: 100%;
	pointer-events: none;
`;

const DonationAmount = styled.div`
	font-size: 140px;
	font-family: var(--mono-font);
	font-weight: 900;
`;

const DonationSymbol = styled.span`
	font-size: 100px;
	font-weight: 400;
`;

const DonationInfo = styled.div`
	font-size: 57px;
	font-weight: bold;
`;

const DonationSite = styled.div`
	font-weight: 600;
`;

const CureCancerLogo = styled.img`
	object-fit: contain;
	height: 100px;
`;

const MetaInformationContainer = styled.div`
	/* position: absolute; */
	/* bottom: 32px; */
	/* display: flex;
	align-items: center;
	justify-content: space-around; */
	/* gap: 16px; */
	/* width: 100%; */
`;

const IncentivesContainer = styled.div`
	width: 100%;
	height: 326px;
	display: flex;
	justify-content: center;
`;

// 1:16 AM Ewan writing this, no idea if I will find this appropriate in the future
const ShitNonDiageticInfoContainer = styled.div`
	/* background: #030c3856; */
	background: #030c3856;
	/* border-radius: 16px 0 0 16px; */
	backdrop-filter: blur(6px);
	padding: 16px;
	box-sizing: border-box;
	
	clip-path: polygon(16px 0%, 100% 0%, 100% 100%, 16px 100%, 0% 684px, 0% 16px);
`;

const LogoContainer = styled.div`
	background: #030c3856;
	padding: 24px;
	border-radius: 16px;
	backdrop-filter: blur(4px);

	img {
		height: 100%;
		width: 100%;
	}
`;

export const Intermission: React.FC = () => {
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors");
	const [incentivesRep] = useReplicant<(Goal | War)[]>("incentives");
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [hostRep] = useReplicant<Commentator | undefined>("host", undefined);
	const [donationRep] = useReplicant<number>("donationTotal");
	const [manualDonationRep] = useReplicant<number>("manual-donation-total");
	const [photosRep] = useReplicant<NodeCG.AssetFile[]>("assets:eventPhotos");
	// const [asmmRep] = useReplicant<number>("asmm:totalKM");

	const intermissionRef = useRef<IntermissionRef>(null);

	useListenFor("showTweet", (newVal) => {
		if (intermissionRef.current) intermissionRef.current.showTweet(newVal);
	});

	useListenFor("playAd", (newVal) => {
		if (intermissionRef.current) intermissionRef.current.showAd(newVal);
	});

	return (
		<IntermissionElement
			ref={intermissionRef}
			activeRun={runDataActiveRep}
			runArray={runDataArrayRep ?? []}
			donation={(donationRep ?? 0) + (manualDonationRep ?? 0)}
			host={hostRep}
			sponsors={sponsorsRep}
			incentives={incentivesRep?.filter((incentive) => incentive.active)}
			photos={photosRep}
			// asmm={asmmRep}
		/>
	);
};

export interface IntermissionRef {
	showTweet: (newVal: ITweet) => void;
	showAd: (ad: string) => void;
}

interface IntermissionProps {
	activeRun: RunDataActiveRun;
	runArray: RunDataArray;
	host?: Commentator;
	donation: number;
	muted?: boolean;
	sponsors?: NodeCG.AssetFile[];
	incentives?: (Goal | War)[];
	asmm?: number;
	photos?: NodeCG.AssetFile[];
}

export const IntermissionElement = forwardRef<IntermissionRef, IntermissionProps>((props, ref) => {
	const [currentHours, setCurrentHours] = useState("And you may ask yourself");
	const [currentMinutes, setCurrentMinutes] = useState("And you may ask yourself"); // dumb dumb dumb dumb dumb
	const [currentDate, setCurrentDate] = useState("Well – How did I get here?");
	const [currentSong, setCurrentSong] = useState("");
	const [showMarquee, setShowMarquee] = useState(false);
	// const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors");
	const songEl = useRef<HTMLSpanElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const bottomBlockRef = useRef<HTMLDivElement>(null);
	const adsRef = useRef<IntermissionAdsRef>(null);
	const incentivesRef = useRef<HTMLDivElement>(null);
	const webcamVideoRef = useRef<HTMLVideoElement>(null);
	const time = useNormalisedTime();

	async function getCurrentSong() {
		const song = await fetch("https://rainwave.cc/api4/info_all?sid=2", { method: "GET" });
		const songJson = await song.json();
		setCurrentSong(
			`${songJson.all_stations_info[2].title} – ${songJson.all_stations_info[2].artists} – ${songJson.all_stations_info[2].album}`,
		);
	}

	useEffect(() => {
		getCurrentSong();
		setCurrentHours(format(new Date(), "h"));
		setCurrentMinutes(format(new Date(), "mm a"));
		setCurrentDate(format(new Date(), "EEEE – d LLLL yyyy"));

		const interval = setInterval(() => {
			setCurrentHours(format(new Date(), "h"));
			setCurrentMinutes(format(new Date(), "mm a"));
			setCurrentDate(format(new Date(), "EEEE – d LLLL yyyy"));
		}, 1000);

		const songInterval = setInterval(() => {
			getCurrentSong();
		}, 3000);

		return () => {
			clearInterval(interval);
			clearInterval(songInterval);
		};
	}, []);

	useEffect(() => {
		if (!songEl.current) return;
		setShowMarquee(songEl.current.offsetWidth < songEl.current.scrollWidth);
	}, [currentSong, songEl]);

	useImperativeHandle(ref, () => ({
		showTweet(_newVal) {},
		showAd(ad) {
			let adDuration = 0;
			switch (ad) {
				case "GOC":
					adDuration = 36;
					break;
				default:
					return;
			}

			if (adsRef.current) {
				if (!audioRef.current) return;
				const tl = gsap.timeline();

				tl.set(audioRef.current, { x: 1 });
				tl.to(audioRef.current, {
					x: 0,
					duration: 5,
					onUpdate: () => {
						if (!audioRef.current) return;
						const dummyElPos = gsap.getProperty(audioRef.current, "x") ?? 0;
						audioRef.current.volume = parseFloat(dummyElPos.toString());
					},
				});
				tl.to(incentivesRef.current, { opacity: 0, duration: 3 });
				tl.call(() => adsRef.current?.showAd(ad));
				tl.to(incentivesRef.current, { opacity: 1, duration: 3 }, `+=${adDuration + 3}`);
				tl.to(
					audioRef.current,
					{
						x: 1,
						duration: 5,
						onUpdate: () => {
							if (!audioRef.current) return;
							const dummyElPos = gsap.getProperty(audioRef.current, "x") ?? 0;
							audioRef.current.volume = parseFloat(dummyElPos.toString());
						},
					},
					"+=10",
				);
			}
		},
	}));

	const currentRunIndex = props.runArray.findIndex((run) => run.id === props.activeRun?.id);
	const nextRuns = clone(props.runArray).slice(currentRunIndex).slice(0, 3);
	// .slice(currentRunIndex + 1)

	// let NextRun;
	// if (nextRuns.length !== 0) {
	// 	NextRun = <InterNextRunItem nextRun run={nextRuns[0]} key={nextRuns[0].id} />;
	// }

	// nextRuns.shift();
	// const RunsArray = nextRuns.map((run) => {
	// 	return <InterNextRunItem run={run} key={run.id} />;
	// });

	// if (RunsArray.length < 2) {
	// 	RunsArray.push(<EndRunItem key="end" />);
	// }

	let playerNames: React.ReactNode[] = [];
	if (nextRuns[0]?.teams.length === 0) {
		playerNames = [];
	} else {
		playerNames = nextRuns[0]?.teams.map((team, index) => {
			const players = team.players.map((player) => player.name).join(", ");
			return (
				<React.Fragment key={index}>
					<FitText text={players} />
					{index !== nextRuns[0]?.teams.length - 1 && <span style={{ fontSize: "60%" }}> vs </span>}
				</React.Fragment>
			);
		});
	}

	// useEffect(() => {
	// 	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	// 		const constraints = { video: { width: 1280, height: 720, facingMode: "user" } };

	// 		navigator.mediaDevices
	// 			.getUserMedia(constraints)
	// 			.then(function (stream) {
	// 				if (!webcamVideoRef.current) return;
	// 				// apply the stream to the video element used in the texture

	// 				webcamVideoRef.current.srcObject = stream;
	// 				webcamVideoRef.current.play();
	// 			})
	// 			.catch(function (error) {
	// 				console.error("Unable to access the camera/webcam.", error);
	// 			});
	// 	} else {
	// 		console.error("MediaDevices interface not available.");
	// 	}
	// }, [webcamVideoRef])

	return (
		<IntermissionContainer time={uiTime(time)}>
			<div
				style={{
					position: "absolute",
					width: 1920,
					height: 1080,
					// background: "#000",
					// clipPath: "path('M 0 0 H 1920 V 1080 H 0 V 1080 H 960 V 540 H 0')",
				}}>
				{/* <img src={DHBackground} /> */}
				<SceneIntermission time={time} />
			</div>
			{/* <video ref={webcamVideoRef} /> */}
			{/* <LogoContainer style={{ position: "absolute", top: 0, left: 0, borderRadius: "0 0 16px 0", height: 120 }}>
				<img src={ASLogo} />
			</LogoContainer> */}
			<LogoContainer style={{ position: "absolute", top: 0, right: 0, borderRadius: "0 0 0 16px", height: 120 }}>
				<img src={GoCLogo} />
			</LogoContainer>
			<ShitNonDiageticInfoContainer
				style={{
					width: 1000,
					height: 700,
					position: "absolute",
					right: 0,
					top: 230,
				}}>
				<RunContainer>
					<div
						style={{
							// height: 406,
							display: "flex",
							flexDirection: "column",
							alignContent: "center",
							justifyContent: "space-between",
							boxSizing: "border-box",
						}}>
						<Title>Next Up</Title>
						<GameName allowNewlines text={nextRuns[0]?.customData.gameDisplay ?? nextRuns[0]?.game} />
						<Category text={nextRuns[0]?.category} />
					</div>
					<div style={{ display: "flex", width: "100%", justifyContent: "space-evenly" }}>
						<PlayerInfo>
							<img src={RunnerIcon} />
							{playerNames}
						</PlayerInfo>
						<TimeInfo>
							<img src={StopwatchIcon} />
							<FitText text={(nextRuns[0]?.estimate ?? "0").substring(1)} />
						</TimeInfo>
						<ConsoleInfo>
							<img src={ConsoleIcon} />
							<FitText text={nextRuns[0]?.system} style={{ maxWidth: "80%" }} />
						</ConsoleInfo>
					</div>
				</RunContainer>
				<IncentivesContainer ref={incentivesRef}>
					{props.incentives && (
						<InterIncentivesMemo incentives={props.incentives} prizes={PRIZES} photos={props.photos} />
					)}
				</IncentivesContainer>
			</ShitNonDiageticInfoContainer>

			{/* 
			<IntermissionAds ref={adsRef} /> */}

			<div
				style={{
					position: "absolute",
					bottom: 16,
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					padding: "0 60px",
					boxSizing: "border-box",
					gap: 16,
				}}>
				{props.host && (
					<HostName>
						<Mic style={{ height: "2.5rem", width: "2.5rem" }} />
						{props.host.name}
						{props.host.pronouns && <HostPronoun>{props.host.pronouns}</HostPronoun>}
					</HostName>
				)}
				<Music>
					<audio
						style={{ transform: "translate(100px, 0px)" }}
						id="intermission-music"
						autoPlay
						preload="auto"
						muted={props.muted}
						ref={audioRef}>
						{/* <source type="audio/mp3" src="http://allrelays.rainwave.cc/ocremix.mp3?46016:hfmhf79FuJ" /> */}
					</audio>
					<div style={{ display: "flex", alignItems: "flex-end", gap: 8, width: "100%" }}>
						<MusicIcon src={MusicIconImg} />
						<MusicLabel>
							<MusicMarquee style={{ opacity: showMarquee ? 1 : 0 }}>
								<MarqueeText style={{ animationDuration: `${currentSong.length * 0.35}s` }}>
									{currentSong}
								</MarqueeText>
							</MusicMarquee>
							<StaticMusicText ref={songEl} style={{ opacity: showMarquee ? 0 : 1 }}>
								{currentSong}
							</StaticMusicText>
						</MusicLabel>
					</div>
				</Music>
				<TimeContainer>
					<CurrentTime>
						{currentHours}
						{/* <span style={{ fontVariantNumeric: "normal", margin: "0 4px" }}>:</span> */}:
						{currentMinutes}
					</CurrentTime>
					<CurrentDate>{currentDate}</CurrentDate>
				</TimeContainer>
			</div>

			{/* <img src={DHBorders} style={{ position: "absolute", width: 1920, height: 1080, pointerEvents: "none" }} /> */}

			{/* <DonationContainer>
				<div style={{ display: "flex", alignItems: "center", gap: 16, height: 150 }}>
					<DonationAmount>
						<DonationSymbol>$</DonationSymbol>
						<LerpNum value={props.donation} />
					</DonationAmount>
					<CureCancerLogo src={GoCLogo} />
				</div>
				<DonationInfo>
					<DonationSite>AusSpeedruns.com/Donate</DonationSite>
				</DonationInfo>
			</DonationContainer> */}
		</IntermissionContainer>
	);
});

IntermissionElement.displayName = "Intermission";

createRoot(document.getElementById("root")!).render(<Intermission />);
