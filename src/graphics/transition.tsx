import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "@emotion/styled";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";

import styles from "./transition.module.css";

import LetterBarImg from "./transition/Letter_Stripe.png";
import Stamp01Img from "./transition/Monkey.png";
import Stamp02Img from "./transition/Triangle.png";
import Stamp03Img from "./transition/CHDING.png";

import InkStampASRLogo from "./transition/Australia_Stamp.png";
import InkStampEventLogo from "./transition/ASM_Stamp.png";

import StampSFX from "./transition/freesound_community-traditional-stamp-44189.mp3";
import PaperSlideSFX from "./transition/oxidvideos-paper-slide-short-478835.mp3";

// import TransitionStatic from "./overlays/backgrounds/TransitionStatic.png";

import Clip1 from "./media/audio/chestappears1.mp3";
import Clip2 from "./media/audio/crystal.mp3";
import Clip3 from "./media/audio/heartcontainer1.mp3";
import Clip4 from "./media/audio/heartpiece1.mp3";
import Clip5 from "./media/audio/itemget1.mp3";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";

const ClipArray = [Clip1, Clip2, Clip3, Clip4, Clip5];

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

	background-size: cover;
	background-position: center;
	image-rendering: pixelated;

	color: white;
	font-family: "Noto Sans";

	& div {
		position: absolute;
	}
`;

const BasicTransition = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;

	opacity: 0;
`;

function runString(runData: RunDataActiveRun | undefined) {
	if (!runData) return ["Enjoy the run!"];

	const allRunners = runData.teams.flatMap((team) => team.players.map((player) => player.name));

	return [runData.game ?? "???", runData.category ?? "???", new Intl.ListFormat().format(allRunners)];
}

const TAGLINES = [
	["Hi Mum!"],
	["Hi Dad!"],
	["Spedrn"],
	["I hope we're on time"],
	["What a great run!"],
	// ["Daily reminder", "Speedrun is one word"],
	// ["Backwards Long Jumps are real!", "Try it!"],
	["Now watch tech do the swap over speedrun!"],
	// ["ausrunsGGshake", "ausrunsGGshake"],
	["Has someone checked in on tech yet?"],
	["crowd jumpscare"],
	["Is Tasmania still attached to the logo?"],
	["ACE still trying to be discovered in AusSpeedruns graphics"],
	// ["It would suck if we were behind schedule", "Which we aren't... right?"],
	// ["GAME NAME", "By RUNNER NAME"],
	// ["By RUNNER NAME", "GAME NAME ...wait hang on"],
];

export function Transition() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [game, setGame] = useState("A cool game name");
	const [category, setCategory] = useState("Category");
	const [runners, setRunners] = useState("by some lots of runners");

	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [automationsRep] = useReplicant("automations");

	useListenFor("transition:UNKNOWN", () => {
		console.log("Transitioning");
		runTransition("basic");
	});

	useListenFor("transition:toIRL", () => {
		console.log("Transitioning");
		runTransition("basic", runString(runDataActiveRep));
	});

	useListenFor("transition:toGame", () => {
		console.log("Transitioning to Game");
		runTransition("toGame", runString(runDataActiveRep));
	});

	useListenFor("transition:toIntermission", () => {
		console.log("Transitioning to Intermission");
		runTransition("toIntermission", TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
		// runTransition("toIntermission");
	});

	function gsapPlaySound(audioRef: React.RefObject<HTMLAudioElement | null>, tl: gsap.core.Timeline, label: string) {
		tl.call(
			() => {
				if (!audioRef.current) return;
				audioRef.current.currentTime = 0;
				void audioRef.current.play();
			},
			[],
			label,
		);
	}

	function runTransition(transition: "toIntermission" | "toGame" | "basic", specialText: string[] = []) {
		switch (transition) {
			case "basic":
				setGame("ASM2026");
				setCategory("");
				setRunners(specialText[0] ?? "");
				break;
			case "toIntermission":
				setGame("ASM2026");
				setCategory(specialText[0] ?? "");
				setRunners(specialText[0] ?? "");
				break;
			case "toGame":
			default:
				setGame(specialText[0] ?? "");
				setCategory(specialText[1] ?? "");
				setRunners(specialText[2] ?? "");
				break;
		}
	}

	const changeBGColor = (col: string) => {
		document.body.style.background = col;
	};

	return (
		<TransitionContainer>
			<TransitionDiv>
			</TransitionDiv>

			{/* <audio ref={audioRef} /> */}
			<button style={{ float: "right" }} onClick={() => runTransition("basic")}>
				Run blank transition
			</button>
			<button style={{ float: "right" }} onClick={() => runTransition("toGame", runString(runDataActiveRep))}>
				Run game transition
			</button>
			<button
				style={{ float: "right" }}
				onClick={() => runTransition("toIntermission", TAGLINES[Math.floor(Math.random() * TAGLINES.length)])}
				// onClick={() => runTransition("toIntermission")}
			>
				Run intermission transition
			</button>
			<div>
				<button onClick={() => changeBGColor("#000")}>Black</button>
				<button onClick={() => changeBGColor("#f00")}>Red</button>
				<button onClick={() => changeBGColor("#0f0")}>Green</button>
				<button onClick={() => changeBGColor("#00f")}>Blue</button>
				<button onClick={() => changeBGColor("rgba(0, 0, 0, 0)")}>Transparent</button>
			</div>
		</TransitionContainer>
	);
}

createRoot(document.getElementById("root")!).render(<Transition />);
