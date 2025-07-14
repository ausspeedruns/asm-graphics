import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import styled, { keyframes } from "styled-components";
import { createRoot } from "react-dom/client";
import { clone } from "underscore";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
import { format } from "date-fns";
import _ from "underscore";
// import { useRive } from "@rive-app/react-canvas";

import type { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Commentator } from "@asm-graphics/types/OverlayProps";
import type NodeCG from "nodecg/types";
import type { Incentive } from "@asm-graphics/types/Incentives";

// import { InterCTA } from "./elements/intermission/cta";
import { InterIncentivesMemo } from "./elements/intermission/incentives";
// import { InterNextRunItem, EndRunItem } from "./elements/intermission/next-run-item";
import { FitText } from "./elements/fit-text";
import { LerpNum } from "./elements/ticker/lerp-num";

// Assets
import Mic from "@mui/icons-material/Mic";
import MusicIconImg from "./media/icons/MusicIcon.svg";
import { Sponsors } from "./elements/sponsors";
import { IntermissionAds, IntermissionAdsRef } from "./elements/intermission/ad";
import GoCLogo from "./media/Sponsors/GoCCCWhite.svg";

import IntermissionBG from "./overlays/backgrounds/Intermission_Traces 1.svg?react";
import ASM25Speaker from "./overlays/backgrounds/Speaker.svg?react";

import StopwatchIcon from "./media/icons/stopwatch.svg";
import RunnerIcon from "./media/icons/runner.svg";
import ConsoleIcon from "./media/icons/console.svg";

// import AusSpeedrunsLogo from './media/AusSpeedruns-Logo.svg';
import { Circuitry } from "./overlays/asm25/circuitry";
import { Chip } from "./overlays/asm25/chip";
import type { DonationMatch } from "@asm-graphics/types/Donations";
import { useNormalisedTime } from "../hooks/useCurrentTime";
import { normalisedTimeToColour, sunriseEnd, sunriseStart, sunsetEnd, sunsetStart } from "./elements/useTimeColour";
import { SectionReactStyles } from "./overlays/asm25/section";
import { Prize } from "@asm-graphics/types/Prizes";

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: var(--main-font);
	display: flex;
	color: var(--text-light);
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
	font-size: 50px;
	color: var(--text-light);
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	font-family: var(--secondary-font);
	font-weight: bold;

	position: absolute;
	left: 565px;
	top: 15px;
`;

const HostPronoun = styled.span`
	font-size: 50%;
	font-weight: 400;
	color: var(--text-light);
	text-transform: uppercase;
	margin-left: 2px;
	background: var(--text-outline);
	height: 70%;
	padding: 4px 8px;
	line-height: 28px;
	font-family: var(--main-font);
	// font-weight: bold;
	display: flex;
	flex-direction: column;
	justify-content: center;

	outline: 1px solid var(--text-light);
	outline-offset: 3px;
	box-shadow: inset 0 -3px 0 0 rgba(0, 0, 0, 0.33);
`;

const MUSIC_WIDTH = 399;

const Music = styled.div`
	max-width: 363px;
	text-align: center;
	display: flex;
	align-items: center;
	font-family: var(--secondary-font);
	flex-shrink: 1;

	position: absolute;
	left: 111px;
	top: 70px;
`;

const MusicLabel = styled.div`
	width: 100%;
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
	height: 50px;
	width: auto;

	position: absolute;
	bottom: 34px;
	left: 490px;
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
	margin-top: 20px;

	& > * {
		z-index: 10;
	}
`;

const DonationAmount = styled.div`
	font-size: 200px;
	font-family: var(--mono-font);
	font-weight: 900;
	-webkit-text-stroke: 4px var(--text-outline);
	// letter-spacing: 8px;
`;

const DonationSymbol = styled.span`
	font-size: 50%;
	font-weight: 400;
	-webkit-text-stroke: 2px #c72;
`;

const DonationInfo = styled.div`
	font-size: 35px;
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
	position: relative;
	margin-top: 124px;
	width: 1000px;
	height: 740px;
`;

const CAMERA_CUTOUT_WIDTH = 95;
const CAMERA_CUTOUT_HEIGHT = 92;
const CAMERA_CUTOUT_HEIGHT_OFFSET = -3;

const PLASTIC_CUTOUT_TOP = 130;
const PLASTIC_CUTOUT_BOTTOM = 820;
const PLASTIC_CUTOUT_LEFT = 80;
const PLASTIC_CUTOUT_RIGHT = 1050;
const PlasticCutout = `path('M 0 0 H 1920 V 1080 H 0 V ${PLASTIC_CUTOUT_TOP} H ${PLASTIC_CUTOUT_LEFT} V ${PLASTIC_CUTOUT_BOTTOM} H ${PLASTIC_CUTOUT_RIGHT} V ${PLASTIC_CUTOUT_TOP} H 0 V 0')`;

const CameraBorder = styled.div`
	width: 100%;
	height: 100%;
	border: 10px solid #e9e9e9;
	background: #000000;
	border-radius: 16px;

	clip-path: polygon(
		0% 0%,
		0% 100%,
		${100 - CAMERA_CUTOUT_WIDTH}% 100%,
		${100 - CAMERA_CUTOUT_WIDTH}% ${100 - CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET}%,
		${CAMERA_CUTOUT_WIDTH}% ${100 - CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET}%,
		${CAMERA_CUTOUT_WIDTH}% ${CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET}%,
		${100 - CAMERA_CUTOUT_WIDTH}% ${CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET}%,
		${100 - CAMERA_CUTOUT_WIDTH}% 100%,
		100% 100%,
		100% 0%
	);

	box-sizing: border-box;
`;

const CameraShadow = styled.div`
	position: absolute;
	top: ${100 - CAMERA_CUTOUT_HEIGHT + CAMERA_CUTOUT_HEIGHT_OFFSET - 0.1}%;
	left: ${100 - CAMERA_CUTOUT_WIDTH - 0.1}%;
	width: ${CAMERA_CUTOUT_WIDTH - (100 - CAMERA_CUTOUT_WIDTH) + 0.1}%;
	height: ${CAMERA_CUTOUT_HEIGHT - (100 - CAMERA_CUTOUT_HEIGHT) + 0.1}%;
	box-shadow: inset 0 0 20px 8px rgba(0, 0, 0, 1);
`;

const CameraChin = styled.div`
	position: absolute;
	bottom: 28px;
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: flex-end;
	color: #939393;
	font-size: 30px;
	gap: 16px;
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

export function Intermission() {
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors");
	const [incentivesRep] = useReplicant<Incentive[]>("incentives");
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [hostRep] = useReplicant<Commentator | undefined>("host", undefined);
	const [donationRep] = useReplicant<number>("donationTotal");
	const [manualDonationRep] = useReplicant<number>("manual-donation-total");
	const [photosRep] = useReplicant<NodeCG.AssetFile[]>("assets:eventPhotos");
	const [donationMatchesRep] = useReplicant<DonationMatch[]>("donation-matches");
	const [prizesRep] = useReplicant<Prize[]>("prizes");
	// const donationRep = 10000; // For testing purposes, replace with the actual donationRep when available

	const normalisedTime = useNormalisedTime(1000);
	// const [normalisedTime, setNormalisedTime] = useState(0);

	const intermissionRef = useRef<IntermissionRef>(null);

	useListenFor("playAd", (newVal) => {
		if (intermissionRef.current) intermissionRef.current.showAd(newVal);
	});

	const currentDonationMultiplier = (donationMatchesRep?.filter((match) => match.active).length ?? 0) + 1;

	return (
		<>
			<IntermissionElement
				ref={intermissionRef}
				activeRun={runDataActiveRep}
				runArray={runDataArrayRep ?? []}
				donation={(donationRep ?? 0) + (manualDonationRep ?? 0)}
				host={hostRep}
				sponsors={sponsorsRep}
				incentives={incentivesRep?.filter((incentive) => incentive.active)}
				photos={photosRep}
				donationMatchMultiplier={currentDonationMultiplier}
				normalisedTime={normalisedTime}
				prizes={prizesRep}
			/>
			<input
				type="range"
				min="0"
				max="1"
				step="0.001"
				value={normalisedTime}
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
	showAd: (ad: string) => void;
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
	ref?: React.Ref<IntermissionRef>;
}

export function IntermissionElement(props: IntermissionProps) {
	const [currentHours, setCurrentHours] = useState("00");
	const [currentMinutes, setCurrentMinutes] = useState("00");
	const [currentDate, setCurrentDate] = useState("Janurary 1st, 1971"); // Yeah you came looking for the UNIX epoch didn't you?
	const [currentSong, setCurrentSong] = useState("");
	const [showMarquee, setShowMarquee] = useState(false);
	const songEl = useRef<HTMLSpanElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const adsRef = useRef<IntermissionAdsRef>(null);
	const incentivesRef = useRef<HTMLDivElement>(null);

	const asm25Colours = normalisedTimeToColour(props.normalisedTime ?? 0);

	async function getCurrentSong() {
		const song = await fetch("https://rainwave.cc/api4/info_all?sid=2", { method: "GET" });
		const songJson = await song.json();
		setCurrentSong(
			`${songJson.all_stations_info[2].title} – ${songJson.all_stations_info[2].artists} – ${songJson.all_stations_info[2].album}`,
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
		showAd(ad) {
			let adDuration = 0;
			switch (ad) {
				case "UrbanClimb":
					adDuration = 36;
					break;
				case "Gigabyte":
					adDuration = 30;
					break;
				case "InfiniteWorlds":
					adDuration = 30;
					break;
				default:
					return;
			}

			if (audioRef.current) {
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
				tl.call(() => adsRef.current?.showAd(ad));
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
					`+=${adDuration} + 10`,
				);
			}
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
				<React.Fragment key={index}>
					<FitText text={players} />
					{index !== nextRuns[0]?.teams.length - 1 && <span style={{ fontSize: "60%" }}> vs </span>}
				</React.Fragment>
			);
		});
	}

	const gameName = nextRuns[0]?.customData.gameDisplay ?? nextRuns[0]?.game ?? "";

	const estimate = nextRuns[0]?.estimate?.startsWith("00:")
		? nextRuns[0]?.estimate?.replace("00:", "0:")
		: nextRuns[0]?.estimate;

	return (
		<IntermissionContainer
			style={
				{
					"--plastic-top": asm25Colours.plasticTop + "80",
					"--plastic-bottom": asm25Colours.plasticBottom,
					"--text-outline": asm25Colours.textOutline,
					"--trace": asm25Colours.trace,
					"--trace-outline": asm25Colours.traceOutline,
					"--chip": asm25Colours.chip,
				} as React.CSSProperties
			}>
			<Circuitry
				noCircuitBoard
				disableBaseColourLayer
				bigShadowAngle={90}
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					zIndex: -2,
					clipPath: PlasticCutout,
				}}
			/>
			{/* <LogoContainer style={{ position: "absolute", top: 0, left: 0, borderRadius: "0 0 16px 0", height: 120 }}>
				<img src={ASLogo} />
			</LogoContainer> */}
			<IntermissionBG style={{ position: "absolute", top: 0, left: 0 }} />

			<LeftColumn>
				<CameraContainer>
					<IntermissionAds ref={adsRef} />
					<CameraBorder />
					<CameraShadow />
					<CameraChin>
						<LocationTag>
							<b>Adelaide,</b> South Australia
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
				<div style={{ width: "80%", position: "relative", height: 150 }}>
					<ASM25Speaker style={{ position: "absolute", top: 20, left: -28, zIndex: 4 }} />
					{props.host && (
						<HostName>
							{/* <Mic style={{ height: "2.5rem", width: "2.5rem" }} /> */}
							<FitText text={props.host.name} alignment="left" style={{ maxWidth: 386 }} />
							{props.host.pronouns && <HostPronoun>{props.host.pronouns}</HostPronoun>}
						</HostName>
					)}
					{/* <MusicIcon src={MusicIconImg} /> */}
					<Mic style={{ height: "auto", width: 65, position: "absolute", top: 44, left: 482 }} />
					<Music>
						<audio
							style={{ transform: "translate(100px, 0px)" }}
							id="intermission-music"
							autoPlay
							preload="auto"
							muted={props.muted}
							ref={audioRef}>
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
			</LeftColumn>
			<RightColumn>
				<DonationContainer>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 16,
							height: 230,
						}}>
						<DonationAmount
							style={{
								fontSize: (props.donationMatchMultiplier ?? 1) > 1 ? 170 : undefined,
								marginTop: (props.donationMatchMultiplier ?? 1) > 1 ? -50 : undefined,
							}}>
							<DonationSymbol>$</DonationSymbol>
							<LerpNum value={props.donation} />
						</DonationAmount>
					</div>
					{/* <DonationInfo>
						<DonationSite>AusSpeedruns.com/Donate</DonationSite>
					</DonationInfo> */}
					{props.donationMatchMultiplier && props.donationMatchMultiplier > 1 && (
						<span style={{ marginTop: -40, fontSize: 30 }}>
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

				<RunContainer style={{ ...SectionReactStyles}}>
					<div
						style={{
							// height: 406,
							display: "flex",
							flexDirection: "column",
							alignContent: "center",
							justifyContent: "space-between",
							boxSizing: "border-box",
							maxWidth: "95%",
						}}>
						{/* <Title>Next Up</Title> */}
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
				</RunContainer>

				<div style={{ position: "relative", width: "100%", height: 330, marginTop: 8 }}>
					<div
						style={{
							position: "absolute",
							width: "100%",
							height: "100%",
							top: 0,
							left: 0,
							display: "flex",
							justifyContent: "center",
						}}>
						<div style={{ width: 700, height: 210, ...SectionReactStyles }} />
					</div>
					<div
						style={{
							position: "absolute",
							width: "100%",
							height: "100%",
							top: 0,
							left: 0,
							display: "flex",
							justifyContent: "center",
							paddingTop: 16,
						}}>
						<IncentivesContainer ref={incentivesRef} style={{ width: 700 }}>
							{props.incentives && (
								<InterIncentivesMemo
									incentives={props.incentives}
									prizes={props.prizes}
									// photos={props.photos}
									upcomingRuns={nextRuns.slice(1, 3)}
								/>
							)}
						</IncentivesContainer>
					</div>
				</div>

				<div style={{ display: "flex", gap: 32, marginTop: 0 }}>
					<div
						style={{
							width: 330,
							height: 115,
							paddingBottom: 16,
							background: "var(--text-outline)",
							padding: 20,
							outline: "3px solid white",
							outlineOffset: "3px",
							position: "relative",
							boxShadow: "inset 0 -6px 0 0 rgba(0, 0, 0, 0.33)",
						}}>
						<Sponsors sponsors={props.sponsors} />
						<div style={{ position: "absolute", bottom: -35, left: 20, fontSize: 20, color: "#fff" }}>
							Sponsors
						</div>
						<div
							style={{
								position: "absolute",
								height: 20,
								bottom: -25,
								left: 5,
								fontSize: 20,
								backgroundColor: "#fff",
								width: 3,
							}}
						/>
						<div
							style={{
								position: "absolute",
								width: 10,
								bottom: -25,
								left: 5,
								fontSize: 20,
								backgroundColor: "#fff",
								height: 2,
							}}
						/>
					</div>

					<div
						style={{
							width: 300,
							height: 115,
							paddingBottom: 16,
							background: "var(--text-outline)",
							padding: 20,
							outline: "3px solid white",
							outlineOffset: "3px",
							position: "relative",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "inset 0 -6px 0 0 rgba(0, 0, 0, 0.33)",
						}}>
						<CureCancerLogo src={GoCLogo} />
						<div style={{ position: "absolute", bottom: -35, left: 20, fontSize: 20, color: "#fff" }}>
							Charity
						</div>
						<div
							style={{
								position: "absolute",
								height: 20,
								bottom: -25,
								left: 5,
								fontSize: 20,
								backgroundColor: "#fff",
								width: 3,
							}}
						/>
						<div
							style={{
								position: "absolute",
								width: 10,
								bottom: -25,
								left: 5,
								fontSize: 20,
								backgroundColor: "#fff",
								height: 2,
							}}
						/>
					</div>
				</div>
			</RightColumn>

			{/* <IntermissionAds ref={adsRef} /> */}
		</IntermissionContainer>
	);
}

createRoot(document.getElementById("root")!).render(<Intermission />);
