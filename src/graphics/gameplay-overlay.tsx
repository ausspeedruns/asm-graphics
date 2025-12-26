import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { HashRouter, Route, Link, Routes } from "react-router";
import { useReplicant } from "@nodecg/react-hooks";
import _ from "underscore";

// import { CurrentOverlay } from '@asm-graphics/types/CurrentOverlay';
import type { RunDataActiveRun, RunDataArray, RunDataPlayer } from "@asm-graphics/types/RunData";
import type { Timer } from "@asm-graphics/types/Timer";
import type { OverlayProps } from "@asm-graphics/types/OverlayProps";
import type NodeCG from "nodecg/types";

import type { AudioIndicator } from "@asm-graphics/types/Audio";

import { TickerOverlay } from "./elements/ticker";
import { Standard } from "./overlays/standard";
import { Standard2 } from "./overlays/standard-2";
import { Widescreen } from "./overlays/widescreen";
import { Widescreen2 } from "./overlays/widescreen-2";
import { Widescreen3 } from "./overlays/widescreen-3";
import { DS } from "./overlays/ds";
import { GBA } from "./overlays/gba";
import { GBA2 } from "./overlays/gba-2";
import { GBC } from "./overlays/gbc";
import { DS2 } from "./overlays/ds-2";
import { WHG } from "./overlays/whg11-8";
import { ThreeDS } from "./overlays/3ds";
import { ThreeDS2 } from "./overlays/3ds-2";
import { NoGraphics } from "./overlays/no-graphics";
import { StandardVertical } from "./overlays/standard-vertical";
import { StandardWidescreen } from "./overlays/standard-widescreen";
import { StandardBand } from "./overlays/standard-band";
import { Widescreen2Bingo } from "./overlays/widescreen-2-bingo";
import { GBC2 } from "./overlays/gbc-2";
import { TopBarOnly } from "./overlays/top-bar-only";

// import { useNormalisedTime } from "../hooks/useCurrentTime";
// import { normalisedTimeToColour, sunriseEnd, sunriseStart, sunsetEnd, sunsetStart } from "./elements/useTimeColour";

const GameplayOverlayCont = styled.div``;

const GameplayContainer = styled.div`
	height: 1080px;
	width: 1920px;
	border-right: 5px solid black;
	border-bottom: 5px solid black;
`;

const SpacedLinks = styled(Link)`
	margin: 16px 16px 0 16px;
	font-weight: bold;
	font-size: 20px;
	text-decoration: none;
	display: inline-block;
`;

interface GameplayOverlayProps {
	preview?: boolean;
}

function GameplayOverlay(props: GameplayOverlayProps) {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [timerRep] = useReplicant<Timer>("timer", { bundle: "nodecg-speedcontrol" });

	const [commentatorsRep] = useReplicant("commentators");
	const [showHostRep] = useReplicant("showHost");
	const host = (commentatorsRep ?? []).find((comm) => comm.id === "host");

	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors", { bundle: "asm-graphics" });

	const [gameAudioIndicatorRep] = useReplicant("game-audio-indicator");
	const [microphoneAudioIndicatorRep] = useReplicant("audio-indicators");

	const [onScreenMessageShowRep] = useReplicant("onScreenWarning:show");
	const [onScreenMessageMessageRep] = useReplicant("onScreenWarning:message");

	const [displayingRun, setDisplayingRun] = useState<RunDataActiveRun>(undefined);

	// const normalisedTime = useNormalisedTime(1000);
	// const [normalisedTime, setNormalisedTime] = useState(0);
	// const asm25Colours = normalisedTimeToColour(normalisedTime);

	// Disable runner audio indicator if they are the only runner and there isn't another commentator (except Host)
	const mutableMicAudioIndicator = _.clone(microphoneAudioIndicatorRep);
	if (
		mutableMicAudioIndicator &&
		commentatorsRep?.length == 0 &&
		runDataActiveRep?.teams.flatMap((team) => team.players).length == 1
	) {
		const runner = runDataActiveRep?.teams.flatMap((team) => team.players)[0];

		if (runner?.customData["microphone"]) {
			mutableMicAudioIndicator[runner.customData["microphone"]] = false;
		}
	}

	const overlayArgs: OverlayProps = {
		runData: displayingRun,
		timer: timerRep,
		commentators: commentatorsRep ?? [],
		preview: props.preview,
		sponsors: sponsorsRep ?? [],
		microphoneAudioIndicator: mutableMicAudioIndicator,
		host: host,
		gameAudioIndicator: gameAudioIndicatorRep ?? -1,
		onScreenWarning: {
			message: onScreenMessageMessageRep ?? "",
			show: onScreenMessageShowRep ?? false,
		},
		showHost: showHostRep ?? true,
	};

	const Overlays = [
		{
			component: <Standard {...overlayArgs} />,
			name: "",
			// Default as standard
		},
		{
			component: <Standard {...overlayArgs} />,
			name: "Standard",
		},
		{
			component: <Standard2 {...overlayArgs} />,
			name: "Standard-2",
		},
		{
			component: <Widescreen {...overlayArgs} />,
			name: "Widescreen",
		},
		{
			component: <Widescreen2 {...overlayArgs} />,
			name: "Widescreen-2",
		},
		{
			component: <Widescreen3 {...overlayArgs} />,
			name: "Widescreen-3",
		},
		{
			component: <DS {...overlayArgs} />,
			name: "DS",
		},
		{
			component: <DS2 {...overlayArgs} />,
			name: "DS-2",
		},
		{
			component: <GBA {...overlayArgs} />,
			name: "GBA",
		},
		{
			component: <GBA2 {...overlayArgs} />,
			name: "GBA-2",
		},
		{
			component: <GBC {...overlayArgs} />,
			name: "GBC",
		},
		{
			component: <GBC2 {...overlayArgs} />,
			name: "GBC-2",
		},
		{
			component: <WHG {...overlayArgs} />,
			name: "WHG",
		},
		{
			component: <ThreeDS {...overlayArgs} />,
			name: "3DS",
		},
		{
			component: <ThreeDS2 {...overlayArgs} />,
			name: "3DS-2",
		},
		{
			component: <StandardVertical {...overlayArgs} />,
			name: "Standard-Vertical",
		},
		{
			component: <StandardWidescreen {...overlayArgs} />,
			name: "Standard-Widescreen",
		},
		{
			component: <StandardBand {...overlayArgs} />,
			name: "Standard-Band",
		},
		{
			component: <Widescreen2Bingo {...overlayArgs} />,
			name: "Widescreen-2-Bingo",
		},
		{
			component: <TopBarOnly {...overlayArgs} />,
			name: "Top-Bar-Only",
		},
		{
			component: <NoGraphics />,
			name: "None",
		},
	];

	useEffect(() => {
		if (props.preview) {
			nodecg.readReplicant("runDataArray", "nodecg-speedcontrol", (runData) => {
				nodecg.readReplicant("runDataActiveRunSurrounding", "nodecg-speedcontrol", (surrounding) => {
					setDisplayingRun(
						(runData as RunDataArray).find(
							(run) =>
								run.id === (surrounding as { previous?: string; current?: string; next?: string }).next,
						),
					);
				});
			});
		} else {
			setDisplayingRun(runDataActiveRep);
		}
	}, [props.preview, runDataActiveRep]);

	const RouteData = Overlays.map((overlay) => {
		return <Route path={`/${overlay.name}`} key={overlay.name} element={overlay.component} />;
	});

	const DevLinks = Overlays.map((overlay) => {
		return (
			<SpacedLinks to={`/${overlay.name}`} key={overlay.name}>
				{overlay.name}
			</SpacedLinks>
		);
	});

	function changeBGColor(col: string) {
		document.body.style.background = col;
	}

	return (
		<GameplayOverlayCont>
			<GameplayContainer
			// style={
			// 	{
			// 		"--plastic-top": asm25Colours.plasticTop + "5C",
			// 		"--plastic-bottom": asm25Colours.plasticBottom,
			// 		"--text-outline": asm25Colours.textOutline,
			// 		"--trace": asm25Colours.trace,
			// 		"--trace-outline": asm25Colours.traceOutline,
			// 		"--chip": asm25Colours.chip,
			// 	} as React.CSSProperties
			// }
			>
				<Routes>{RouteData}</Routes>
				<TickerOverlay />
			</GameplayContainer>

			{DevLinks}
			{/* <input
				style={{ display: "block", width: "100%" }}
				type="range"
				min="0"
				max="1"
				step="0.01"
				value={normalisedTime}
				// onChange={(e) => setNormalisedTime(parseFloat(e.target.value))}
			/> */}
			<div>
				{/* <button onClick={() => setNormalisedTime(0)}>Midday</button>
				<button onClick={() => setNormalisedTime((sunsetStart + sunsetEnd) / 2)}>Sunset</button>
				<button onClick={() => setNormalisedTime(0.5)}>Night</button>
				<button onClick={() => setNormalisedTime((sunriseStart + sunriseEnd) / 2)}>Sunrise</button> */}
			</div>
			<div>
				<button onClick={() => changeBGColor("#000")}>Black</button>
				<button onClick={() => changeBGColor("#f00")}>Red</button>
				<button onClick={() => changeBGColor("#0f0")}>Green</button>
				<button onClick={() => changeBGColor("#00f")}>Blue</button>
				<button onClick={() => changeBGColor("rgba(0, 0, 0, 0)")}>Transparent</button>
				<button onClick={() => nodecg.sendMessage("start-credits")}>Credits</button>
			</div>
		</GameplayOverlayCont>
	);
}

createRoot(document.getElementById("root")!).render(
	<HashRouter>
		<GameplayOverlay />
	</HashRouter>,
);
