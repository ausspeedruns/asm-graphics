import { useEffect, useState, useMemo, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";

import { useReplicant } from "@nodecg/react-hooks";
import { AudioFader } from "./dashboards/runner-tablet/audio-fader";
import { Headsets, HostHeadset } from "../shared/audio-data";

import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData";
import styles from "./host-dashboard-audio.module.css";

interface HostDashAudioProps {
	style?: CSSProperties;
}

export function HostDashAudio(props: HostDashAudioProps) {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [commentatorsRep] = useReplicant("commentators");
	const [busFadersRep] = useReplicant("x32:busFaders");
	const [faderValues, setFaderValues] = useState<number[][]>([]);

	const numberOfRunners = useMemo(
		() => runDataActiveRep?.teams.reduce((total, team) => total + team.players.length, 0) ?? 0,
		[runDataActiveRep],
	);
	const headsetUserMap = useMemo(() => {
		const map = new Map(Headsets.map((headset) => [headset.name, headset.name]));
		runDataActiveRep?.teams.map((team) => {
			team.players.map((player) => {
				if ("microphone" in player.customData && typeof player.customData["microphone"] === "string") {
					map.set(player.customData["microphone"], player.name);
				}
			});
		});

		commentatorsRep?.map((couch) => {
			if (couch.customData["microphone"] && typeof couch.customData["microphone"] === "string") {
				map.set(couch.customData["microphone"], couch.name);
			}
		});

		return map;
	}, [runDataActiveRep, commentatorsRep]);

	useEffect(() => {
		setFaderValues(busFadersRep ?? []);
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
		void nodecg.sendMessage("x32:setFader", { float: float, channel: channel, mixBus: mixBus });
	};

	return (
		<div className={styles.mixingContainer} {...props}>
			<h1>Headphone Volume</h1>
			<AudioFader
				key={"MASTER"}
				label={"MASTER"}
				mixBus={HostHeadset.mixBus}
				channel={0}
				value={faderValues[HostHeadset.mixBus]?.[0]}
				onChange={(float) => handleFaderChange(float, HostHeadset.mixBus, 0)}
				colour={"#000"}
			/>
			<h1>Games</h1>
			{[...Array(numberOfRunners).keys()].map((number) => {
				return (
					<AudioFader
						key={number}
						label={`Game ${number + 1}`}
						mixBus={HostHeadset.mixBus}
						channel={9 + number * 2}
						value={faderValues[HostHeadset.mixBus]?.[9 + number + number * 2]}
						onChange={(float) => handleFaderChange(float, HostHeadset.mixBus, 9 + number * 2)}
						colour={"#000"}
					/>
				);
			})}
			<h1>Runners</h1>
			{Headsets.map((headset) => {
				return (
					<AudioFader
						key={headset.name}
						label={headsetUserMap.get(headset.name) ?? headset.name}
						mixBus={HostHeadset.mixBus}
						channel={headset.micInput}
						value={faderValues[HostHeadset.mixBus]?.[headset.micInput]}
						onChange={(float) => handleFaderChange(float, HostHeadset.mixBus, headset.micInput)}
						colour={"#000"}
					/>
				);
			})}
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<HostDashAudio />);
