import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useListenFor, useReplicant } from "use-nodecg";
import gsap from "gsap";
import { useRive } from "@rive-app/react-canvas";

// import ASMLogo from './media/ASM2022 Logo.svg';
// import BGIMG from './media/pixel/Transition/BG.png';
// import StartWipeIMG from './media/pixel/Transition/StartWipe.png';
// import EndWipeIMG from './media/pixel/Transition/EndWipe.png';

// @ts-ignore
// import ASAP23Transition from "./elements/event-specific/pax-23/asap2023_transition.riv";

import Clip1 from "./media/audio/chestappears1.mp3";
import Clip2 from "./media/audio/crystal.mp3";
import Clip3 from "./media/audio/heartcontainer1.mp3";
import Clip4 from "./media/audio/heartpiece1.mp3";
import Clip5 from "./media/audio/itemget1.mp3";

import SPECIAL_AUDIO from "./media/audio/SPECIAL.mp3";
import { RunDataActiveRun } from "@asm-graphics/types/RunData";

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
`;

function runString(runData: RunDataActiveRun | undefined) {
	if (!runData) return "Enjoy the run!";

	const allRunners = runData.teams.flatMap((team) => team.players.map((player) => player.name));

	return `${runData.game} by ${new Intl.ListFormat().format(allRunners)}`;
}

const TAGLINES = [
	"Hi Mum!",
	"Hi Dad!",
	"Spedrn",
	"I hope we're on time",
	"What a great run!",
	"Daily reminder: Speedrun is one word",
	"Backwards Long Jumps are real! Try it!",
	"OzSpeedruns.com also works btw",
	"Everyone in the second row has to donate",
	"Now watch tech do the swap over speedrun!",
	"ausrunsGGshake",
	"now everyone see how fast they can donate",
	"Has someone checked in on tech yet?",
	"crowd jumpscare",
	"I hope game devs aren't mad at us",
	"Is Tasmania still attached to the logo?",
	"ACE still trying to be discovered in AusSpeedruns graphics",
	"It would suck if we were behind schedule. Which we aren't... right?",
];

export const Transition: React.FC = () => {
	const [specialAudio] = useReplicant<boolean>("SPECIAL_AUDIO", false);
	const audioRef = useRef<HTMLAudioElement>(null);
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});

	const { rive, RiveComponent } = useRive({
		src: "/bundles/asm-graphics/shared/design/asap2023_transition.riv",
		autoplay: false,
	});

	useListenFor("runTransitionGraphic", () => {
		console.log("Transitioning");
		runTransition();
	});
	
	useListenFor("transition:toGame", () => {
		console.log("Transitioning to Game");
		runTransition(runString(runDataActiveRep));
	});

	useListenFor("transition:toIntermission", () => {
		console.log("Transitioning to Intermission");
		runTransition(TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
	});

	useEffect(() => {
		rive?.stopRendering();
	}, [rive]);

	function runTransition(specialText = "") {
		console.log("Running");

		const tl = gsap.timeline();
		tl.call(
			() => {
				if (!audioRef.current) return;

				if (specialAudio) {
					audioRef.current.src = SPECIAL_AUDIO;
				} else {
					audioRef.current.src = ClipArray[Math.floor(Math.random() * ClipArray.length)];
				}
				audioRef.current.play();
			},
			[],
			specialAudio ? undefined : "+=1.2",
		);
		
		console.log(rive);
		if (rive) {
			rive.startRendering();
			rive.reset();

			rive.setTextRunValue("TransitionInformation", specialText);
			rive.play();
		}
	}

	const changeBGColor = (col: string) => {
		document.body.style.background = col;
	};

	return (
		<TransitionContainer>
			<TransitionDiv>
				<RiveComponent />
			</TransitionDiv>

			<audio ref={audioRef} />
			<button style={{ float: "right" }} onClick={() => runTransition()}>
				Run blank transition
			</button>
			<button style={{ float: "right" }} onClick={() => runTransition(runString(runDataActiveRep))}>
				Run game transition
			</button>
			<button style={{ float: "right" }} onClick={() => runTransition(TAGLINES[Math.floor(Math.random() * TAGLINES.length)])}>
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
};

createRoot(document.getElementById("root")!).render(<Transition />);
