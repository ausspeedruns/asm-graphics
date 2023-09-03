import React, { useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { useReplicant } from "use-nodecg";
import { HEADSETS } from "./dashboards/runner-tablet/headsets";
import { AudioFader } from "./dashboards/runner-tablet/audio-fader";
import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { CouchPerson } from "@asm-graphics/types/OverlayProps";

const MixingContainer = styled.div`
	font-family:
		Noto Sans,
		sans-serif;
	width: 100%;
	height: 500px;
	border: 5px solid black;
	margin: auto;
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding-top: 16px;
	padding-bottom: 48px;
`;

const MixingDivide = styled.div`
	height: 100%;
	width: 5px;
	background: black;
`;

const HOST_MIXBUS = 11;

export const HostDashAudio: React.FC = () => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const [couchNamesRep] = useReplicant<CouchPerson[]>("couch-names", []);
	const [busFadersRep] = useReplicant<number[][]>("x32:busFaders", []);
	const [faderValues, setFaderValues] = useState<number[][]>([]);

	const numberOfRunners = useMemo(
		() => runDataActiveRep?.teams.reduce((total, team) => total + team.players.length, 0) ?? 0,
		[runDataActiveRep],
	);
	const headsetUserMap = useMemo(() => {
		const map = new Map(HEADSETS.map((headset) => [headset.name, headset.name]));
		runDataActiveRep?.teams.map((team) => {
			team.players.map((player) => {
				if ("microphone" in player.customData) map.set(player.customData.microphone, player.name);
			});
		});

		couchNamesRep.map((couch) => {
			if (couch.microphone) map.set(couch.microphone, couch.name);
		});

		return map;
	}, [runDataActiveRep, couchNamesRep]);

	useEffect(() => {
		setFaderValues(busFadersRep);
	}, [busFadersRep]);

	const handleFaderChange = (float: number, mixBus: number, channel: number) => {
		const nextFaderValues = faderValues.map((faders, faderMixBus) => {
			if (faderMixBus === mixBus) {
				return faders.map((fader, faderChannel) => {
					if (faderChannel === channel) {
						return float;
					} else {
						return fader;
					}
				});
			} else {
				return faders;
			}
		});

		setFaderValues(nextFaderValues);
		nodecg.sendMessage("x32:setFader", { float: float, channel: channel, mixBus: mixBus });
	};

	return (
		<MixingContainer>
			<AudioFader
				key={"MASTER"}
				label={"MASTER"}
				mixBus={HOST_MIXBUS}
				channel={0}
				value={faderValues[HOST_MIXBUS]?.[0]}
				onChange={(float) => handleFaderChange(float, HOST_MIXBUS, 0)}
				colour={"#000"}
			/>
			<MixingDivide />
			{[...Array(numberOfRunners).keys()].map((number) => {
				return (
					<AudioFader
						key={number}
						label={`Game ${number + 1}`}
						mixBus={HOST_MIXBUS}
						channel={9 + number * 2}
						value={faderValues[HOST_MIXBUS]?.[9 + number + number * 2]}
						onChange={(float) => handleFaderChange(float, HOST_MIXBUS, 9 + number * 2)}
						colour={"#000"}
					/>
				);
			})}
			<MixingDivide />
			{HEADSETS.map((headset) => {
				return (
					<AudioFader
						key={headset.name}
						label={headsetUserMap.get(headset.name) ?? headset.name}
						mixBus={HOST_MIXBUS}
						channel={headset.channel}
						value={faderValues[HOST_MIXBUS]?.[headset.channel]}
						onChange={(float) => handleFaderChange(float, HOST_MIXBUS, headset.channel)}
						colour={"#000"}
					/>
				);
			})}
		</MixingContainer>
	);
};

createRoot(document.getElementById("root")!).render(<HostDashAudio />);
