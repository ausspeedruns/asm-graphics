import React, { useState, useEffect, useRef, useImperativeHandle, Fragment } from "react";
import styled, { keyframes } from "styled-components";
import { createRoot } from "react-dom/client";
import { clone } from "underscore";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
import { format } from "date-fns";
import _ from "underscore";
// import { useRive } from "@rive-app/react-canvas";

import type NodeCG from "nodecg/types";
import type { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Commentator } from "@asm-graphics/types/OverlayProps";
import type { Incentive } from "@asm-graphics/types/Incentives";

// import { InterCTA } from "./elements/intermission/cta";
// import { InterIncentivesMemo } from "./elements/intermission/incentives";
// import { InterNextRunItem, EndRunItem } from "./elements/intermission/next-run-item";
import { FitText } from "./elements/fit-text";
import { LerpNum } from "./elements/ticker/lerp-num";

// Assets
import Mic from "@mui/icons-material/Mic";
import MusicIconImg from "./media/icons/MusicIcon.svg";
// import { Sponsors } from "./elements/sponsors";
import { IntermissionVideoComponent, IntermissionAdsRef } from "./elements/intermission/video";
import GoCLogo from "./media/Sponsors/GoCCCBlack.svg";
import ASLogo from "./media/AusSpeedruns-LogoBlack.svg";

import StopwatchIcon from "./media/icons/stopwatch.svg";
import RunnerIcon from "./media/icons/runner.svg";
import ConsoleIcon from "./media/icons/console.svg";

import IntermissionBG from "./overlays/backgrounds/Intermission.png";

// import AusSpeedrunsLogo from './media/AusSpeedruns-Logo.svg';
import type { DonationMatch } from "@asm-graphics/types/Donations";
import { useNormalisedTime } from "../hooks/useCurrentTime";
// import { normalisedTimeToColour, sunriseEnd, sunriseStart, sunsetEnd, sunsetStart } from "./elements/useTimeColour";
import { Prize } from "@asm-graphics/types/Prizes";
import type { IntermissionVideo } from "../extensions/intermission-videos";
import { ASAP25UpcomingRun } from "./elements/intermission/asap25/upcoming-run";
import { Incentives } from "./elements/intermission/asap25/incentives";

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: var(--main-font);
	display: flex;
	color: var(--text-dark);
	// clip-path: path('M 0 0 H 1920 V 1080 H 0 V 958 H 960 V 120 H 0');
`;

const LeftColumn = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	position: absolute;
	left: 0px;
	height: 1080px;
	width: 1125px;
`;

const RightColumn = styled.div`
	display: flex;
	position: absolute;
	right: 0px;
	height: 1080px;
	width: 850px;
	flex-direction: column;
	align-items: center;
`;

const HostName = styled.div`
	font-size: 28px;
	color: var(--text-dark);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	font-family: var(--secondary-font);
	font-weight: bold;
	justify-content: center;

	// position: absolute;
	// left: 565px;
	// top: 15px;

	// ASAP2025
	font-family: var(--main-font);
`;

const HostPronoun = styled.span`
	font-size: 80%;
	font-weight: 400;
	text-transform: uppercase;
	font-family: var(--main-font);
`;

const MUSIC_WIDTH = 405;

const Music = styled.div`
	max-width: 405px;
	text-align: center;
	display: flex;
	align-items: center;
	font-family: var(--main-font);
	flex-shrink: 1;

	// position: absolute;
	left: 111px;
	top: 70px;
`;

const MusicLabel = styled.div`
	width: 100%;
	/* height: 100%; */
	color: var(--text-dark);
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
	height: 40px;
	width: auto;

	// position: absolute;
	bottom: 34px;
	left: 490px;
`;

const MusicMarquee = styled.div`
	/* width: ${MUSIC_WIDTH}px; */
	width: 100%;
	margin: 0 auto;
	overflow: hidden;
	box-sizing: border-box;
	color: var(--text-dark);
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
	width: 750px;
	max-width: 750px;
	height: 215px;
	font-size: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 16px;
`;

const Title = styled.div`
	font-size: 50px;
	font-weight: 300;
	text-align: center;
`;

const GameName = styled(FitText)<{ containsNewLine?: boolean }>`
	/* font-weight: bold; */
	max-width: 80%;
	padding: 0 10%;
	font-size: ${({ containsNewLine }) => (containsNewLine ? "50px" : "80px")};
	line-height: ${({ containsNewLine }) => (containsNewLine ? "50px" : "80px")};
	margin: ${({ containsNewLine }) => (containsNewLine ? "5px" : "20px")} 0px;
	font-family: var(--secondary-font);
	text-transform: uppercase;
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
	max-width: 50%;
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
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 30px;
	gap: 8px;
	/* min-width: 730px; */
`;

const CurrentTime = styled.span`
	font-weight: bold;
	font-family: var(--mono-font);
	// margin-right: 16px;
`;

const CurrentDate = styled.span`
	/* font-size: 32px; */
`;

const DonationContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	pointer-events: none;
	color: #ffc94b;

	& > * {
		z-index: 10;
	}
`;

const DonationAmount = styled.div`
	font-size: 180px;
	font-family: var(--mono-font);
	font-weight: 900;
	-webkit-text-stroke: 6px black;
	// letter-spacing: 8px;
`;

const DonationSymbol = styled.span`
	font-size: 80%;
	font-weight: 400;
	-webkit-text-stroke: 5px black;
`;

const DonationInfo = styled.div`
	font-size: 40px;
	font-weight: 900;
	margin-top: -10px;
	text-transform: uppercase;
`;

const DonationSite = styled.div`
	font-weight: 900;
	color: black;
`;

const CureCancerLogo = styled.img`
	object-fit: contain;
	height: 70px;
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
	width: 700px;
	height: 300px;
	display: flex;
	justify-content: center;
	font-size: 30px;
`;

const LogoContainer = styled.div`
	background: #030c3856;
	padding: 24px;
	border-radius: 16px;
	backdrop-filter: blur(4px);

	img {
		height: 100%;
		width: 100%;
		object-fit: contain;
	}
`;

const CameraContainer = styled.div`
	position: absolute;
	top: 80px;
	width: 1059px;
	height: 705px;
	left: 57px;
`;

// const CAMERA_CUTOUT_WIDTH = 95;
// const CAMERA_CUTOUT_HEIGHT = 92;
// const CAMERA_CUTOUT_HEIGHT_OFFSET = -3;

const PLASTIC_CUTOUT_TOP = 80;
const PLASTIC_CUTOUT_BOTTOM = 785;
const PLASTIC_CUTOUT_LEFT = 57;
const PLASTIC_CUTOUT_RIGHT = 1116;
// const PlasticCutout = `path('M 0 0 H 1920 V 1080 H 0 V ${PLASTIC_CUTOUT_TOP} H ${PLASTIC_CUTOUT_LEFT} V ${PLASTIC_CUTOUT_BOTTOM} H ${PLASTIC_CUTOUT_RIGHT} V ${PLASTIC_CUTOUT_TOP} H 0 V 0')`;

// const CameraBorder = styled.div`
// 	width: 100%;
// 	height: 100%;
// 	border: 10px solid #e9e9e9;
// 	background: #000000;
// 	border-radius: 16px;

// 	clip-path: polygon(
// 		0% 0%,
// 		0% 100%,
// 		${100 - CAMERA_CUTOUT_WIDTH}% 100%,
// 		${100 - CAMERA_CUTOUT_WIDTH}% ${100 - CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET}%,
// 		${CAMERA_CUTOUT_WIDTH}% ${100 - CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET}%,
// 		${CAMERA_CUTOUT_WIDTH}% ${CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET}%,
// 		${100 - CAMERA_CUTOUT_WIDTH}% ${CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET}%,
// 		${100 - CAMERA_CUTOUT_WIDTH}% 100%,
// 		100% 100%,
// 		100% 0%
// 	);

// 	box-sizing: border-box;
// `;

const BackgroundCutout = `path('M 0 0 H 1920 V 1080 H 0 V ${PLASTIC_CUTOUT_TOP} H ${PLASTIC_CUTOUT_LEFT} V ${PLASTIC_CUTOUT_BOTTOM} H ${PLASTIC_CUTOUT_RIGHT} V ${PLASTIC_CUTOUT_TOP} H 0 V 0')`;

// const CameraShadow = styled.div`
// 	position: absolute;
// 	top: ${100 - CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET - 0.1}%;
// 	left: ${100 - CAMERA_CUTOUT_WIDTH - 0.1}%;
// 	width: ${CAMERA_CUTOUT_WIDTH - (100 - CAMERA_CUTOUT_WIDTH) + 0.1}%;
// 	height: ${CAMERA_CUTOUT_HEIGHT - (100 - CAMERA_CUTOUT_HEIGHT) + 0.1}%;
// 	box-shadow: inset 0 0 20px 8px rgba(0, 0, 0, 1);
// `;

const CameraChin = styled.div`
	position: absolute;
	bottom: 0px;
	padding-bottom: 8px;
	padding-top: 8px;
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: flex-end;
	color: #fff;
	font-size: 30px;
	gap: 16px;
	z-index: 5;

	background: linear-gradient(0deg, #0000009b, transparent);
`;

const GradientTextWhiteBackground = styled.div`
	background: white;
	padding: 2px 4px;
	border-radius: 8px;
	display: inline-block;
`;

const GradientAnimation = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const GradientText = styled.div`
	background: var(--goc-gradient);
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;

	// display: flex;
	// flex-direction: column;
	// justify-content: center;
	// align-items: center;

	animation: ${GradientAnimation} 5s ease infinite;
	background-size: 400% 400%;
`;

const MultiplierText = styled.div`
	font-weight: 900;
`;

const LocationTag = styled.div``;

const ASAP2025Dot = styled.div`
	height: 15px;
	width: 15px;
	background: #000000;
	border-radius: 50%;
	position: absolute;
	z-index: 10;
`;

export function Intermission() {
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors");
	const [incentivesRep] = useReplicant<Incentive[]>("incentives");
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [donationRep] = useReplicant<number>("donationTotal");
	const [manualDonationRep] = useReplicant<number>("manual-donation-total");
	const [photosRep] = useReplicant<NodeCG.AssetFile[]>("assets:eventPhotos");
	const [donationMatchesRep] = useReplicant<DonationMatch[]>("donation-matches");
	const [prizesRep] = useReplicant<Prize[]>("prizes");
	const [videosRep] = useReplicant<IntermissionVideo[]>("intermission-videos");
	const [commentatorsRep] = useReplicant<Commentator[]>("commentators");
	// const donationRep = 10000; // For testing purposes, replace with the actual donationRep when available

	// const normalisedTime = useNormalisedTime(1000);
	// const [normalisedTime, setNormalisedTime] = useState(0);

	const intermissionRef = useRef<IntermissionRef>(null);

	useListenFor("intermission-videos:play", (newVal) => {
		if (!intermissionRef.current) return;

		const foundVideo = videosRep?.find((video) => video.asset === newVal);
		if (foundVideo) {
			intermissionRef.current.showVideo(foundVideo);
		}
	});

	const currentDonationMultiplier = (donationMatchesRep?.filter((match) => match.active).length ?? 0) + 1;

	const host = (commentatorsRep ?? []).find((comm) => comm.id === "host");

	return (
		<>
			<IntermissionElement
				ref={intermissionRef}
				activeRun={runDataActiveRep}
				runArray={runDataArrayRep ?? []}
				donation={(donationRep ?? 0) + (manualDonationRep ?? 0)}
				host={host}
				sponsors={sponsorsRep}
				incentives={incentivesRep?.filter((incentive) => incentive.active)}
				photos={photosRep}
				donationMatchMultiplier={currentDonationMultiplier}
				// normalisedTime={normalisedTime}
				prizes={prizesRep}
			/>
			<input
				type="range"
				min="0"
				max="1"
				step="0.001"
				// value={normalisedTime}
				style={{ width: "100%" }}
				// onChange={(e) => setNormalisedTime(parseFloat(e.target.value))}
			/>
			<div>
				{/* <button onClick={() => setNormalisedTime(0)}>Midday</button>
				<button onClick={() => setNormalisedTime((sunsetStart + sunsetEnd) / 2)}>Sunset</button>
				<button onClick={() => setNormalisedTime(0.5)}>Night</button>
				<button onClick={() => setNormalisedTime((sunriseStart + sunriseEnd) / 2)}>Sunrise</button> */}
			</div>
		</>
	);
}

export interface IntermissionRef {
	showVideo: (video: IntermissionVideo) => void;
}

interface IntermissionProps {
	activeRun: RunDataActiveRun;
	runArray: RunDataArray;
	host?: Commentator;
	donation: number;
	muted?: boolean;
	sponsors?: NodeCG.AssetFile[];
	incentives?: Incentive[];
	normalisedTime?: number;
	photos?: NodeCG.AssetFile[];
	donationMatchMultiplier?: number;
	prizes?: Prize[];
	videos?: IntermissionVideo[];
	ref?: React.Ref<IntermissionRef>;
}

export function IntermissionElement(props: IntermissionProps) {
	const [currentHours, setCurrentHours] = useState(format(new Date(), "h"));
	const [currentMinutes, setCurrentMinutes] = useState(format(new Date(), "mm a"));
	const [currentDate, setCurrentDate] = useState(format(new Date(), "EEEE – d LLLL yyyy")); // Yeah you came looking for the UNIX epoch didn't you?
	const [currentSong, setCurrentSong] = useState("");
	const [showMarquee, setShowMarquee] = useState(false);
	const songEl = useRef<HTMLSpanElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const adsRef = useRef<IntermissionAdsRef>(null);
	const incentivesRef = useRef<HTMLDivElement>(null);

	async function getCurrentSong() {
		const song = await fetch("https://rainwave.cc/api4/info_all?sid=2", { method: "GET" });
		const songJson = await song.json();
		setCurrentSong(
			`${songJson.all_stations_info[2].title} – ${songJson.all_stations_info[2].artists} – ${songJson.all_stations_info[2].album}`
		);
	}

	useEffect(() => {
		getCurrentSong();
		setTimes();

		const interval = setInterval(setTimes, 1000);

		const songInterval = setInterval(() => {
			getCurrentSong();
		}, 3000);

		function setTimes() {
			const now = new Date();
			setCurrentHours(format(now, "h"));
			setCurrentMinutes(format(now, "mm a"));
			setCurrentDate(format(now, "EEEE – d LLLL yyyy"));
		}

		return () => {
			clearInterval(interval);
			clearInterval(songInterval);
		};
	}, []);

	useEffect(() => {
		if (!songEl.current) return;
		setShowMarquee(songEl.current.offsetWidth < songEl.current.scrollWidth);
	}, [currentSong, songEl]);

	useImperativeHandle(props.ref, () => ({
		showVideo(video) {
			if (!audioRef.current || !video.videoInfo) return;

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
			// tl.to(incentivesRef.current, { opacity: 0, duration: 3 });
			tl.call(() => adsRef.current?.showVideo(video));
			// tl.to(incentivesRef.current, { opacity: 1, duration: 3 }, `+=${adDuration + 3}`);
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
				`+=${video.videoInfo.duration} + 10`
			);
		},
	}));

	const currentRunIndex = props.runArray.findIndex((run) => run.id === props.activeRun?.id);
	const nextRuns = clone(props.runArray).slice(currentRunIndex).slice(0, 3);

	let playerNames: React.ReactNode[] = [];
	if (nextRuns[0]?.teams.length === 0) {
		playerNames = [];
	} else {
		playerNames = nextRuns[0]?.teams.map((team, index) => {
			const players = team.players.map((player) => player.name).join(", ");
			return (
				<Fragment key={index}>
					<FitText text={players} />
					{index !== nextRuns[0]?.teams.length - 1 && <span style={{ fontSize: "60%" }}> vs </span>}
				</Fragment>
			);
		});
	}

	const gameName = nextRuns[0]?.customData.gameDisplay ?? nextRuns[0]?.game ?? "";

	const estimate = nextRuns[0]?.estimate?.startsWith("00:")
		? nextRuns[0]?.estimate?.replace("00:", "0:")
		: nextRuns[0]?.estimate;

	return (
		<IntermissionContainer>
			{/* <LogoContainer style={{ position: "absolute", top: 0, left: 0, borderRadius: "0 0 16px 0", height: 120 }}>
				<img src={ASLogo} />
			</LogoContainer> */}
			<img src={IntermissionBG} style={{ position: "absolute", top: 0, left: 0, clipPath: BackgroundCutout }} />
			<LeftColumn>
				<CameraContainer>
					<IntermissionVideoComponent ref={adsRef} videos={props.videos} />
					{/* <CameraBorder /> */}
					{/* <CameraShadow /> */}
					<CameraChin>
						<LocationTag>
							<b>Melbourne,</b> Victoria
						</LocationTag>
						–
						<TimeContainer>
							<CurrentTime>
								{currentHours}:{currentMinutes}
							</CurrentTime>
							<CurrentDate>{currentDate}</CurrentDate>
						</TimeContainer>
					</CameraChin>
				</CameraContainer>
				{props.host && (
					<div style={{ position: "absolute", top: 820, left: 551, display: "flex" }}>
						<Mic style={{ height: 40, width: "auto" }} />
						<HostName>
							{/* <Mic style={{ height: "2.5rem", width: "2.5rem" }} /> */}
							<FitText text={props.host.name} alignment="left" style={{ maxWidth: 386 }} />
							{props.host.pronouns && <HostPronoun>{props.host.pronouns}</HostPronoun>}
						</HostName>
					</div>
				)}
				<div
					style={{
						position: "absolute",
						top: 820,
						left: 106,
						color: "black",
						display: "flex",
						alignItems: "center",
					}}
				>
					<MusicIcon src={MusicIconImg} />
					<Music>
						<audio
							style={{ transform: "translate(100px, 0px)" }}
							id="intermission-music"
							autoPlay
							preload="auto"
							muted={props.muted}
							ref={audioRef}
						>
							<source type="audio/mp3" src="http://allrelays.rainwave.cc/ocremix.mp3?46016:hfmhf79FuJ" />
						</audio>
						<div style={{ display: "flex", alignItems: "flex-end", gap: 8, width: "100%" }}>
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
				</div>
				<Incentives incentives={props.incentives} style={{ position: "absolute", top: 944, left: 120 }} />
			</LeftColumn>
			<RightColumn>
				<DonationContainer style={{ alignSelf: "flex-end", width: 739, height: 412, paddingTop: 10, justifyContent: "space-evenly" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 16,
							height: 129,
							marginBottom: 31,
						}}
					>
						<DonationAmount
							style={{
								fontSize: (props.donationMatchMultiplier ?? 1) > 1 ? 170 : undefined,
								marginTop: (props.donationMatchMultiplier ?? 1) > 1 ? -50 : undefined,
							}}
						>
							<DonationSymbol>$</DonationSymbol>
							<LerpNum value={props.donation} />
						</DonationAmount>
					</div>
					<DonationInfo>
						<DonationSite>AusSpeedruns.com/Donate</DonationSite>
					</DonationInfo>

					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "72%" }}>
						<CureCancerLogo src={GoCLogo} />
						<img src={ASLogo} style={{ height: 50 }} />
					</div>
					{/* {props.donationMatchMultiplier && props.donationMatchMultiplier > 1 && ( */}
					{props.donationMatchMultiplier && (
						<span style={{ marginTop: 5, fontSize: 30, color: "black", fontWeight: "600" }}>
							Donations are worth{" "}
							<GradientTextWhiteBackground>
								<GradientText>
									<MultiplierText>{props.donationMatchMultiplier}×</MultiplierText>
								</GradientText>
							</GradientTextWhiteBackground>{" "}
							right now!
						</span>
					)}
				</DonationContainer>

				{/* <RunContainer>
					<div
						style={{
							// height: 406,
							display: "flex",
							flexDirection: "column",
							alignContent: "center",
							justifyContent: "space-between",
							boxSizing: "border-box",
							maxWidth: "95%",
						}}
					>
						<GameName containsNewLine={gameName.includes("\\n")} allowNewlines text={gameName} />
						<Category text={nextRuns[0]?.category} />
					</div>
					<div style={{ display: "flex", width: "90%", justifyContent: "space-between" }}>
						<PlayerInfo>
							<img src={RunnerIcon} />
							{playerNames}
						</PlayerInfo>
						<TimeInfo>
							<img src={StopwatchIcon} />
							<FitText text={estimate ?? "0"} />
						</TimeInfo>
						<ConsoleInfo>
							<img src={ConsoleIcon} />
							<FitText text={nextRuns[0]?.system} style={{ maxWidth: "80%" }} />
						</ConsoleInfo>
					</div>
				</RunContainer> */}

				<div style={{ position: "absolute", top: 450, left: 62, display: "flex", flexDirection: "column", gap: 16 }}>
					<ASAP25UpcomingRun run={nextRuns[0]} players={playerNames} isNext />
					{nextRuns[1] && <ASAP25UpcomingRun run={nextRuns[1]} players={playerNames} />}
					{nextRuns[2] && <ASAP25UpcomingRun run={nextRuns[2]} players={playerNames} />}
				</div>

				{/* <IncentivesContainer ref={incentivesRef} style={{ width: 700 }}>
							{props.incentives && (
								<InterIncentivesMemo
									incentives={props.incentives}
									prizes={props.prizes}
									// photos={props.photos}
									upcomingRuns={nextRuns.slice(1, 3)}
								/>
							)}
						</IncentivesContainer> */}
			</RightColumn>
			{/* <IntermissionAds ref={adsRef} /> */}
			<ASAP2025Dot style={{ top: 788, left: 120 }} /> {/* Song */}
			<ASAP2025Dot style={{ top: 788, left: 564 }} /> {/* Host */}
		</IntermissionContainer>
	);
}

createRoot(document.getElementById("root")!).render(<Intermission />);
