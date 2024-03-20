import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import styled, { keyframes } from "styled-components";
import { createRoot } from "react-dom/client";
import clone from "clone";
import { useListenFor, useReplicant } from "use-nodecg";
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
import { InterIncentivesFallback } from "./elements/intermission/incentives-fallback";
// import { InterNextRunItem, EndRunItem } from "./elements/intermission/next-run-item";
import Mic from "@mui/icons-material/Mic";
import { FitText } from "./elements/fit-text";

// Assets
import MusicIconImg from "./media/icons/MusicIcon.svg";
// import { Sponsors } from "./elements/sponsors";
import { IntermissionAds, IntermissionAdsRef } from "./elements/intermission/ad";
// import AusSpeedrunsLogo from "./media/AusSpeedruns-Logo.svg";
import GoCLogo from "./media/Sponsors/GoCCCWhite.svg";

import TGXBackground from "./elements/event-specific/tgx-24/intermission.svg";

import StopwatchIcon from "./media/icons/stopwatch.svg";
import RunnerIcon from "./media/icons/runner.svg";
import ConsoleIcon from "./media/icons/console.svg";

const IntermissionContainer = styled.div`
	position: relative;
	width: 1920px;
	height: 1080px;
	overflow: hidden;
	font-family: var(--main-font);
	display: flex;
	color: var(--text-light);
	background: url(${TGXBackground});
	/* clip-path: path('M 0 0 H 1920 V 1080 H 0 V 958 H 960 V 120 H 0'); */
`;

// const ClippedBackground = styled.div`
// 	height: 1080px;
// 	width: 1920px;
// 	position: absolute;
// 	clip-path: path('M 0 0 H 1920 V 1080 H 0 V 958 H 945 V 120 H 0');
// 	background: var(--main);
// `;

// const TGXDiamond = (props: {
// 	children?: React.ReactNode;
// 	colour: string;
// 	size: number;
// 	style?: React.CSSProperties;
// }) => {
// 	return (
// 		<div
// 			style={{
// 				transform: "rotate(45deg)",
// 				borderWidth: 30,
// 				borderColor: props.colour,
// 				borderStyle: "solid",
// 				background: "var(--main)",
// 				height: props.size,
// 				width: props.size,
// 				...props.style,
// 				overflow: "hidden",
// 			}}>
// 			<div style={{ background: `${props.colour}40`, position: "absolute", width: "100%", height: "100%" }} />
// 			<div style={{ transform: "rotate(-45deg)" }}>{props.children}</div>
// 		</div>
// 	);
// };

// const Half = styled.div`
// 	height: 100%;
// 	width: 960px;
// 	position: relative;
// 	overflow: hidden;
// `;

// const NextRuns = styled.div`
// 	margin: auto;
// 	color: var(--text-light);
// 	width: 788px;
// 	height: 362px;
// 	display: flex;
// 	flex-direction: column;
// 	align-items: center;
// 	padding-top: 25px;
// 	z-index: 2;
// `;

// const RunsList = styled.div`
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	/* flex-grow: 1; */
// 	width: 100%;
// 	/* height: 100%; */
// 	height: 272px;
// 	gap: 8px;
// 	z-index: 1;
// 	/* margin-top: 10px; */
// 	padding: 8px;
// 	box-sizing: border-box;
// `;

// const FutureRuns = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	justify-content: space-between;
// 	flex-grow: 1;
// 	height: 100%;
// 	gap: 8px;
// `;

// const DirectNextRun = styled.div`
// 	flex-grow: 1;
// 	height: 100%;
// 	/* min-width: 384px; */
// `;

// const IncentiveBlock = styled.div`
// 	color: var(--text-light);
// 	font-family: var(--main-font);
// 	width: 100%;
// 	height: 200px;
// 	display: flex;
// 	flex-direction: column;
// 	align-items: center;
// 	/* clip-path: path("M 120 0 V 120 H 80 V 200 H 880 V 120 H 840 V 0 Z"); */
// 	/* clip-path: path('M 120 0 V 40 H 80 V 80 H 40 V 200 H 920 V 80 H 880 V 40 H 840 V 0 Z'); */
// `;

// const MiddleContent = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	justify-content: space-around;
// 	align-items: center;
// 	z-index: 10;
// 	position: absolute;
// 	top: 640px;
// 	width: 100%;
// `;

// const BottomBlock = styled.div`
// 	position: absolute;
// 	bottom: 0;
// 	height: 113px;
// 	width: 100%;
// 	display: flex;
// 	justify-content: space-evenly;
// 	box-sizing: border-box;
// 	align-items: center;
// `;

// const Time = styled.span`
// 	font-weight: 900;
// 	font-size: 50px;
// 	/* color: var(--text-light); */
// 	color: var(--pax23-accent);
// 	margin-bottom: 0px;
// 	z-index: 1;
// 	font-family: var(--mono-font);
// `;

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
	color: var(--text-dark);
	text-transform: uppercase;
	margin-left: 8px;
	background: var(--sec);
	height: 28px;
	padding: 0 4px;
	line-height: 28px;
	font-family: var(--main-font);
	font-weight: bold;
`;

const MUSIC_WIDTH = 400;

const Music = styled.div`
	width: 100%;
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
	clip-path: polygon(0 0, 100% 1%, 100% 100%, 8% 100%);
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

// const LocationBug = styled.div`
// 	color: var(--text-light);
// 	/* background: var(--sec); */
// 	width: fit-content;
// 	padding: 15px 40px;
// 	font-size: 40px;
// 	display: flex;
// 	flex-direction: row;
// 	justify-content: space-between;
// 	align-items: center;
// 	position: absolute;
// 	bottom: 0px;
// 	width: 100%;
// 	box-sizing: border-box;
// 	background: var(--main);
// `;

// const CameraBox = styled.div`
// 	height: 1080px;
// `;

const RunContainer = styled.div`
	width: 100%;
	height: 380px;
	display: flex;
	align-items: center;
	flex-direction: column;
	position: absolute;
	justify-content: space-between;
	font-size: 35px;
`;

const Container = styled.div`
	width: 100%;
	height: 380px;
	display: flex;
	align-items: center;
	flex-direction: column;
	position: absolute;
	justify-content: space-between;
	font-size: 35px;
`;

const Title = styled.div`
	font-size: 50px;
	font-weight: 900;
`;

const GameInfo = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	gap: 0;
	font-size: 50px;
`;

const GameName = styled(FitText)`
	font-weight: bold;
	max-width: 720px;
`;

const Category = styled(FitText)`
	max-width: 620px;
	font-size: 80%;
`;

const PlayerInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	max-width: 480px;
`;

const TimeInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const ConsoleInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	max-width: 220px;
`;

const TimeContainer = styled.div`
	position: absolute;
	right: 32px;
	top: 8px;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	float: right;
	width: 500px;
`;

const CurrentTime = styled.span`
	font-size: 80px;
	font-weight: bold;
	font-variant-numeric: tabular-nums;
`;

const CurrentDate = styled.span`
	font-size: 32px;
`;

const DonationContainer = styled.div`
	display: flex;
	position: absolute;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
	height: 100%;
	right: 32px;
	gap: 40px;
`;

const DonationAmount = styled.div`
	font-size: 150px;
	height: 150px;
`;

const DonationSymbol = styled.span`
	font-size: 100px;
	font-weight: bold;
`;

const DonationInfo = styled.div`
	font-size: 70px;
	font-weight: bold;
`;

const DonationInstruction = styled.div`
	float: right;
	margin-bottom: -22px;
`;

const DonationSite = styled.div`
	font-weight: 900;
`;

const CureCancerLogo = styled.img`
	object-fit: contain;
	height: 150px;
`;

const MetaInformationContainer = styled.div`
	position: absolute;
	bottom: 32px;
	right: 32px;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: flex-end;
	gap: 16px;
	width: 470px;
`;

const TGXIncentivesContainer = styled.div`
	width: 100%;
	height: 540px;
	position: absolute;
	bottom: 0;
	display: flex;
	justify-content: center;
`;

const TGXIncentivesClip = styled.div`
	width: 1000px;
	clip-path: polygon(50% 8%, 0% 100%, 100% 100%);
`;

export const Intermission: React.FC = () => {
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors", []);
	const [incentivesRep] = useReplicant<(Goal | War)[]>("incentives", []);
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", [], { namespace: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const [hostRep] = useReplicant<Commentator | undefined>("host", undefined);
	const [donationRep] = useReplicant<number>("donationTotal", 100);
	const [manualDonationRep] = useReplicant<number>("manual-donation-total", 0);
	const [asmmRep] = useReplicant<number>("asmm:totalKM", 0);

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
			runArray={runDataArrayRep}
			donation={donationRep + manualDonationRep}
			host={hostRep}
			sponsors={sponsorsRep}
			incentives={incentivesRep.filter((incentive) => incentive.active)}
			asmm={asmmRep}
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
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors", []);
	const songEl = useRef<HTMLSpanElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const bottomBlockRef = useRef<HTMLDivElement>(null);
	const adsRef = useRef<IntermissionAdsRef>(null);

	const { rive: intermissionVideoRive, RiveComponent: IntermissionRive } = useRive({
		src: "/bundles/asm-graphics/shared/design/tgx_transition.riv",
		autoplay: false,
		artboard: "Intermission Video",
	});

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
				tl.call(() => {
					if (intermissionVideoRive) {
						intermissionVideoRive.startRendering();
						intermissionVideoRive.play("Open");
					}
				});
				tl.call(() => adsRef.current?.showAd(ad), [], "+=2");
				tl.call(
					() => {
						if (intermissionVideoRive) {
							intermissionVideoRive.play("Close");
						}
					},
					[],
					`+=${adDuration + 5}`,
				);
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
					`+=${adDuration + 10}`,
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
			{/* <ClippedBackground>
			</ClippedBackground> */}
			<RunContainer>
				<Title>Up Next</Title>
				<GameInfo>
					<GameName text={nextRuns[0]?.game} />
					<Category text={nextRuns[0]?.category} />
				</GameInfo>
				<PlayerInfo>
					<img src={RunnerIcon} />
					{playerNames}
				</PlayerInfo>
				<TimeInfo>
					<img src={StopwatchIcon} />
					<FitText text={nextRuns[0]?.estimate} />
				</TimeInfo>
				<ConsoleInfo>
					<img src={ConsoleIcon} />
					<FitText text={nextRuns[0]?.system} style={{ maxWidth: "80%" }} />
				</ConsoleInfo>
			</RunContainer>
			<TimeContainer>
				<CurrentTime>
					{currentHours}
					<span style={{ fontVariantNumeric: "normal", margin: "0 8px" }}>:</span>
					{currentMinutes}
				</CurrentTime>
				<CurrentDate>{currentDate}</CurrentDate>
			</TimeContainer>
			<DonationContainer>
				<DonationAmount>
					<DonationSymbol>$</DonationSymbol>5,000
				</DonationAmount>
				<DonationInfo>
					<DonationInstruction>Donate At</DonationInstruction>
					<DonationSite>AusSpeedruns.com</DonationSite>
				</DonationInfo>
				<CureCancerLogo src={GoCLogo} />
			</DonationContainer>

			<MetaInformationContainer>
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
						<MusicIcon src={MusicIconImg} />
					</div>
				</Music>
				{props.host && (
					<HostName>
						{props.host.name}
						{props.host.pronouns && <HostPronoun>{props.host.pronouns}</HostPronoun>}
						<Mic style={{ height: "2.5rem", width: "2.5rem" }} />
					</HostName>
				)}
			</MetaInformationContainer>

			<TGXIncentivesContainer>
				<TGXIncentivesClip>
					{props.incentives && props.incentives.length > 0 ? (
						<InterIncentivesMemo incentives={props.incentives} />
					) : (
						<InterIncentivesFallback />
					)}
				</TGXIncentivesClip>
			</TGXIncentivesContainer>
			<IntermissionRive style={{ zIndex: 3 }} />
			<TGXIncentivesContainer style={{ zIndex: 4 }}>
				<IntermissionAds ref={adsRef} />
			</TGXIncentivesContainer>
			{/* <Half style={{ borderRight: "1px solid var(--sec)" }}>
				<IntermissionAds ref={adsRef} style={{ position: "absolute", left: 59, top: 59 }} />
				<CameraBox />
				<LocationBug>
					<img src={} style={{ position: "absolute", left: 0, height: "126%", bottom: 0 }} />
					<div></div>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
						<span style={{ fontWeight: "bold", marginBottom: -17 }}>Melbourne</span>
						<span>Victoria</span>
					</div>
				</LocationBug>
			</Half>
			<Half style={{ background: "var(--main)", borderLeft: "1px solid var(--sec)" }}>
				<NextRuns>
					<Time>{currentTime}</Time>
					<RunsList>
						<DirectNextRun>{NextRun}</DirectNextRun>
						<FutureRuns>{RunsArray}</FutureRuns>
					</RunsList>
				</NextRuns>
				<InterCTA donation={props.donation} style={{ zIndex: 1, position: "absolute", top: 380 }} />
				<MiddleContent>
					<IncentiveBlock>
						{props.incentives && props.incentives.length > 0 ? (
							<InterIncentivesMemo incentives={props.incentives} />
						) : (
							<InterIncentivesFallback />
						)}
					</IncentiveBlock>
				</MiddleContent>
				<div
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						position: "absolute",
						bottom: 100,
					}}>
					<Sponsors sponsors={sponsorsRep} style={{ width: 600, height: 160 }} />
				</div>
				<BottomBlock ref={bottomBlockRef}>
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
							<source type="audio/mp3" src="http://allrelays.rainwave.cc/ocremix.mp3?46016:hfmhf79FuJ" />
						</audio>
						<div style={{ display: "flex" }}>
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
							<MusicIcon src={MusicIconImg} />
						</div>
					</Music>
				</BottomBlock>
			</Half> */}
		</IntermissionContainer>
	);
});

IntermissionElement.displayName = "Intermission";

createRoot(document.getElementById("root")!).render(<Intermission />);
