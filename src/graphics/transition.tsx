import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
import { useRive } from "@rive-app/react-canvas";

// import ASMLogo from './media/ASM2022 Logo.svg';
// import BGIMG from './media/pixel/Transition/BG.png';
// import StartWipeIMG from './media/pixel/Transition/StartWipe.png';
// import EndWipeIMG from './media/pixel/Transition/EndWipe.png';

// @ts-ignore
// import ASAP23Transition from "./elements/event-specific/pax-23/asap2023_transition.riv";
import ASGX23Transitions from "./elements/event-specific/tgx-24/";

import Clip1 from "./media/audio/chestappears1.mp3";
import Clip2 from "./media/audio/crystal.mp3";
import Clip3 from "./media/audio/heartcontainer1.mp3";
import Clip4 from "./media/audio/heartpiece1.mp3";
import Clip5 from "./media/audio/itemget1.mp3";

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

	& div {
		position: absolute;
	}
`;

function runString(runData: RunDataActiveRun | undefined) {
	if (!runData) return ["Enjoy the run!"];

	const allRunners = runData.teams.flatMap((team) => team.players.map((player) => player.name));

	return [runData.game ?? "???", `By ${new Intl.ListFormat().format(allRunners)}`];
}

function breakText(text: string) {
    // Just find the middle space
    const spaces = text.match(/\s/g);
    if (spaces && spaces.length > 1) {
        const middleIndex = Math.floor(spaces.length / 2);
        let spaceCounter = 0;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === " ") {
                if (spaceCounter == middleIndex) {
                    return text.substring(0, i) + "\n" + text.substring(i + 1);
                }

                spaceCounter++;
            }
        }
    }

    return text;
}

const TAGLINES = [
	["Hi Mum!"],
	["Hi Dad!"],
	["Spedrn"],
	["I hope we're on time"],
	["What a great run!"],
	["Daily reminder", "Speedrun is one word"],
	// ["Backwards Long Jumps are real!", "Try it!"],
	["Now watch tech do the swap over speedrun!"],
	["ausrunsGGshake", "ausrunsGGshake"],
	["Has someone checked in on tech yet?"],
	["crowd jumpscare"],
	["Is Tasmania still attached to the logo?"],
	// ["ACE still trying to be discovered in AusSpeedruns graphics"],
	["It would suck if we were behind schedule", "Which we aren't... right?"],
	["Look ma! I'm  W I D E", "Yes, that's very nice dear."],
	["GAME NAME", "By RUNNER NAME"],
	["By RUNNER NAME", "GAME NAME ...wait hang on"],
];

// fuck it we hardcode balling
const LongGames: Record<string, string> = {
	"Spyro 2: Ripto's Rage - Reignited": "Spyro 2:\nRipto's Rage - Reignited",
	"Kingdom Hearts: Chain of Memories": "Kingdom Hearts:\nChain of Memories",
	"Spyro Year of the Dragon - Reignited": "Spyro Year of the Dragon\n- Reignited",
	"Who Wants to be a Millionaire": "Who Wants to\nbe a Millionaire",
	"Bioshock Infinite: Burial At Sea Episode 1": "Bioshock Infinite\nBurial At Sea Episode 1"
}

export const Transition: React.FC = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });

	const { rive: normalRive, RiveComponent: NormalTransitions } = useRive({
		src: "/bundles/asm-graphics/shared/design/dh_transition.riv",
		autoplay: false,
		artboard: "Transition",
	});

	useListenFor("transition:UNKNOWN", () => {
		console.log("Transitioning");
		runTransition("basic");
	});

	useListenFor("transition:toIRL", () => {
		console.log("Transitioning");
		runTransition("basic");
	});

	useListenFor("transition:toGame", () => {
		console.log("Transitioning to Game");
		runTransition("toGame", runString(runDataActiveRep));
	});

	useListenFor("transition:toIntermission", () => {
		console.log("Transitioning to Intermission");
		runTransition("toIntermission", TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
	});

	useEffect(() => {
		normalRive?.stopRendering();
	}, [normalRive]);

	function runTransition(transition: "toIntermission" | "toGame" | "basic", specialText: string[] = []) {
		console.log("Running");

		const tl = gsap.timeline();
		tl.call(
			() => {
				if (!audioRef.current) return;
				audioRef.current.src = ClipArray[Math.floor(Math.random() * ClipArray.length)];
				audioRef.current.play();
			},
			[],
			"+=2",
		);

		switch (transition) {
			case "basic":
			case "toIntermission":
			case "toGame":
			default:
				if (normalRive) {
					normalRive.startRendering();
					normalRive.reset();

					let mainText = specialText?.[0] ?? "";
					let normalTransition = true;

					if (mainText.length > 30) {
						normalTransition = false;

						if (mainText in LongGames) {
							mainText = LongGames[mainText];
						} else {
							mainText = breakText(mainText);
						}
					}

					normalRive.setTextRunValue("MainLine", mainText.toUpperCase());
					normalRive.setTextRunValue("ByLine", specialText?.[1] ?? "");
					normalRive.play(normalTransition ? "Transition" : "Transition SmallText");
				}
				break;
		}
	}

	const changeBGColor = (col: string) => {
		document.body.style.background = col;
	};

	return (
		<TransitionContainer>
			<TransitionDiv>
				<NormalTransitions />
			</TransitionDiv>

			<audio ref={audioRef} />
			<button style={{ float: "right" }} onClick={() => runTransition("basic")}>
				Run blank transition
			</button>
			<button style={{ float: "right" }} onClick={() => runTransition("toGame", runString(runDataActiveRep))}>
				Run game transition
			</button>
			<button
				style={{ float: "right" }}
				onClick={() => runTransition("toIntermission", TAGLINES[Math.floor(Math.random() * TAGLINES.length)])}>
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
