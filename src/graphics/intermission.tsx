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

import DHBorders from "./elements/event-specific/dh-24/IntermissionBorders.svg";
import DHBackground from "./elements/event-specific/dh-24/IntermissionBackground.png";
import DHLogo from "./elements/event-specific/dh-24/DreamHack_Logo_RGB_WHITE.png";
import ASLogo from "./media/AusSpeedruns-Logo.svg";
import { PRIZES } from "./prizes";

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: var(--main-font);
	display: flex;
	color: var(--text-light);
	/* clip-path: path('M 0 0 H 1920 V 1080 H 0 V 958 H 960 V 120 H 0'); */
`;

const HostName = styled.div`
	font-size: 28px;
	color: var(--text-light);
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-family: var(--secondary-font);
	font-weight: bold;
`;

const HostPronoun = styled.span`
	font-size: 20px;
	font-weight: 400;
	color: var(--text-light);
	text-transform: uppercase;
	margin-left: 8px;
	background: var(--sec);
	height: 28px;
	padding: 0 4px;
	line-height: 28px;
	/* font-family: var(--main-font); */
	font-weight: bold;
`;

const MUSIC_WIDTH = 400;

const Music = styled.div`
	max-width: 60%;
	text-align: center;
	display: flex;
	justify-content: flex-end;
`;

const MusicLabel = styled.div`
	/* width: ${MUSIC_WIDTH}px; */
	width: 91%;
	height: 100%;
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
	width: 50%;
	height: 533px;
	position: absolute;
	justify-content: space-between;
	font-size: 35px;
	font-family: var(--secondary-font);
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
	font-size: 110px;
	line-height: 110px;
	font-family: var(--main-font);
	text-transform: uppercase;
`;

const Category = styled(FitText)`
	font-size: 120%;
	max-width: 80%;
	padding: 0 10%;
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
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	float: right;
	width: 553px;
	font-family: var(--secondary-font);
`;

const CurrentTime = styled.span`
	font-size: 66px;
	height: 80px;
	font-weight: bold;
	font-family: var(--mono-font);
`;

const CurrentDate = styled.span`
	font-size: 32px;
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
	font-family: var(--secondary-font);
	font-weight: 600;
`;

const CureCancerLogo = styled.img`
	object-fit: contain;
	height: 100px;
`;

const MetaInformationContainer = styled.div`
	position: absolute;
	bottom: 32px;
	display: flex;
	align-items: center;
	justify-content: space-around;
	gap: 16px;
	width: 100%;
`;

const IncentivesContainer = styled.div`
	width: 952px;
	height: 533px;
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	justify-content: center;
`;

export const Intermission: React.FC = () => {
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors");
	const [incentivesRep] = useReplicant<(Goal | War)[]>("incentives");
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [hostRep] = useReplicant<Commentator | undefined>("host", undefined);
	const [donationRep] = useReplicant<number>("donationTotal");
	const [manualDonationRep] = useReplicant<number>("manual-donation-total");
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

	return (
		<IntermissionContainer>
			<div
				style={{
					position: "absolute",
					width: 1920,
					height: 1080,
					background: "#000",
					clipPath: "path('M 0 0 H 1920 V 1080 H 0 V 1080 H 960 V 540 H 0')",
				}}>
				<img src={DHBackground} />
			</div>
			<RunContainer>
				<div
					style={{
						height: 406,
						display: "flex",
						flexDirection: "column",
						alignContent: "center",
						justifyContent: "space-between",
						padding: 20,
						boxSizing: "border-box",
					}}>
					<Title>Next Up</Title>
					<GameName allowNewlines text={nextRuns[0]?.customData.gameDisplay ?? nextRuns[0]?.game} />
					<Category text={nextRuns[0]?.category} />
				</div>
				<div
					style={{
						width: 554,
						height: 126,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<div style={{ display: "flex", width: "100%", justifyContent: "space-evenly" }}>
						<TimeInfo>
							<img src={StopwatchIcon} />
							<FitText text={(nextRuns[0]?.estimate ?? "0").substring(1)} />
						</TimeInfo>
						<ConsoleInfo>
							<img src={ConsoleIcon} />
							<FitText text={nextRuns[0]?.system} style={{ maxWidth: "80%" }} />
						</ConsoleInfo>
					</div>
					<PlayerInfo>
						<img src={RunnerIcon} />
						{playerNames}
					</PlayerInfo>
				</div>
			</RunContainer>

			<IncentivesContainer ref={incentivesRef}>
				{props.incentives && <InterIncentivesMemo incentives={props.incentives} prizes={PRIZES} />}
			</IncentivesContainer>
			<IntermissionAds ref={adsRef} />

			<div style={{ position: "absolute", top: 548, right: 0, height: 533, width: 932 }}>
				<div style={{ width: 554, float: "right", height: 126 }}>
					<TimeContainer>
						<CurrentTime>
							{currentHours}
							<span style={{ fontVariantNumeric: "normal", margin: "0 4px" }}>:</span>
							{currentMinutes}
						</CurrentTime>
						<CurrentDate>{currentDate}</CurrentDate>
					</TimeContainer>
				</div>
				<div style={{ position: "absolute", width: "100%", top: 126, height: 406 }}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							marginTop: 70,
							gap: 50,
						}}>
						<img src={DHLogo} style={{ width: 590 }} />
						<img src={ASLogo} style={{ width: 500 }} />
					</div>
					<MetaInformationContainer>
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
								<source
									type="audio/mp3"
									src="http://allrelays.rainwave.cc/ocremix.mp3?46016:hfmhf79FuJ"
								/>
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
					</MetaInformationContainer>
				</div>
			</div>

			<img src={DHBorders} style={{ position: "absolute", width: 1920, height: 1080, pointerEvents: "none" }} />

			<DonationContainer>
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
			</DonationContainer>
		</IntermissionContainer>
	);
});

IntermissionElement.displayName = "Intermission";

createRoot(document.getElementById("root")!).render(<Intermission />);
