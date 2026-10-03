import { useEffect, useMemo, useState } from "react";
import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData.js";
import clsx from "clsx";
import { useReplicant } from "@nodecg/react-hooks";
import { AudioFader } from "./audio-fader.js";
import equal from "fast-deep-equal";
import usePrevious from "@asm-graphics/shared-browser/hooks/usePrevious.js";
import { FitText } from "@asm-graphics/shared-browser/fit-text.js";
import { Headsets, HostHeadset, HostReferenceChannel } from "../../../shared/audio-data.js";
const gameAudio = [
	{ name: "Game 1", channel: 9 },
	{ name: "Game 2", channel: 11 },
	{ name: "Game 3", channel: 13},
	{ name: "Game 4", channel: 15 },
];

import styles from "./audio.module.css";

function adjustHexColour(hex: string, amount: number) {
	let col = hex.replace("#", "");
	if (col.length === 3) {
		col = col
			.split("")
			.map((c) => c + c)
			.join("");
	}
	const num = parseInt(col, 16);
	let r = (num >> 16) + amount;
	let g = ((num >> 8) & 0x00ff) + amount;
	let b = (num & 0x0000ff) + amount;

	r = Math.max(Math.min(255, r), 0);
	g = Math.max(Math.min(255, g), 0);
	b = Math.max(Math.min(255, b), 0);

	const value = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
	return value;
}


interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const RTAudio = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [couchNamesRep] = useReplicant("commentators");
	const [busFadersRep] = useReplicant("x32:busFaders");

	const [selectedHeadset, setSelectedHeadset] = useState<string>(Headsets[0].name);
	const [faderValues, setFaderValues] = useState<number[][]>([]);
	const debouncedFadersRep = useAudioDebounce(busFadersRep ?? [], 500);

	const headsetUserMap = useMemo(() => {
		const map = new Map();
		runDataActiveRep?.teams.map((team) => {
			team.players.map((player) => {
				if ("microphone" in player.customData) map.set(player.customData["microphone"], player.name);
			});
		});

		couchNamesRep?.map((couch) => {
			if (couch.customData?.["microphone"]) map.set(couch.customData["microphone"], couch.name);
		});

		return map;
	}, [runDataActiveRep, couchNamesRep]);

	const sortedHeadsets = useMemo(() => {
		const selectedHeadsetArray = [];
		const headsetsWithUser = [];
		const headsetsWithoutUser = [];

		for (const headset of Headsets) {
			if (headset.name === selectedHeadset) {
				selectedHeadsetArray.push(headset);
			} else if (headsetUserMap.has(headset.name)) {
				headsetsWithUser.push(headset);
			} else if (headset.name != "Host") {
				headsetsWithoutUser.push(headset);
			}
		}

		return [...selectedHeadsetArray, ...headsetsWithUser, ...headsetsWithoutUser];
	}, [selectedHeadset, headsetUserMap]);

	useEffect(() => {
		setFaderValues(debouncedFadersRep);
	}, [debouncedFadersRep]);

	const selectedHeadsetObj = Headsets.find((headset) => headset.name === selectedHeadset);
	const headsetUser = selectedHeadsetObj ? headsetUserMap.get(selectedHeadsetObj.name) : "";

	// MixBus falls back to 16 since it is an unused bus (FX4)
	const mixBus = selectedHeadsetObj?.mixBus ?? 16;

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

	const editingText = `Editing ${headsetUser === selectedHeadsetObj?.name ? selectedHeadset : (headsetUser ?? selectedHeadset)}`;

	// const gameAudio = gameAudioNamesRep
	// 	?.map((gameAudio, index) => ({ name: gameAudio, index }))
	// 	.filter((gameAudio) => !!gameAudio.name);

	return (
		<div className={clsx(styles.rtaudioContainer, props.className)} style={props.style}>
			<div className={styles.headsetSelectorContainer} style={{ backgroundColor: selectedHeadsetObj?.colour }}>
				{Headsets.filter((headset) => headset.name !== "Host" && headset.name !== "NONE").map((headset) => {
					const selected = selectedHeadset === headset.name;

					return (
						<button
							className={clsx(styles.headsetName, selected && styles.selected)}
							key={headset.name}
							style={{
								"--headset-colour": headset.colour,
								"--headset-text-colour": headset.textColour,
								"--pulse-colour": adjustHexColour(headset.colour ?? "#ffffff", -60),
							} as React.CSSProperties}
							onClick={() => setSelectedHeadset(headset.name)}
						>
							<FitText
								style={{ maxWidth: "100%" }}
								text={headsetUserMap.get(headset.name) ?? headset.name}
							/>
						</button>
					);
				})}
			</div>
			<div className={styles.mixingScrollable}>
				<div className={styles.mixingContainer} style={{ background: `${selectedHeadsetObj?.colour}22` }}>
					<FitText className={styles.bigName} text={editingText} />
					<span className={styles.categoryName}>Main Volume</span>
					<AudioFader
						mixBus={mixBus}
						channel={0}
						value={faderValues[mixBus]?.[0]}
						onChange={(float) => handleFaderChange(float, mixBus, 0)}
						colour={selectedHeadsetObj?.colour}
					/>
					<span className={styles.categoryName}>Game</span>
					{gameAudio?.map((gameAudioName, i) => {
						return (
							<AudioFader
								key={i}
								label={`Game ${i + 1}`}
								mixBus={mixBus}
								channel={gameAudioName.channel}
								value={faderValues[mixBus]?.[gameAudioName.channel]}
								onChange={(float) => handleFaderChange(float, mixBus, gameAudioName.channel)}
								colour={"#000"}
							/>
						);
					})}
					<span className={styles.categoryName}>Host</span>
					<AudioFader
						mixBus={mixBus}
						channel={HostReferenceChannel}
						value={faderValues[mixBus]?.[HostReferenceChannel]}
						onChange={(float) => {
							// Change both Host Headset and Reference Channel
							handleFaderChange(float, mixBus, HostHeadset.micInput);
							handleFaderChange(float, mixBus, HostReferenceChannel);
						}}
						colour={"#000"}
					/>
					<span className={styles.categoryName}>Commentary</span>
					{sortedHeadsets
						.filter((headset) => headset.name !== "NONE")
						.map((headset) => {
							return (
								<AudioFader
									key={headset.name}
									label={
										headset.name === selectedHeadset
											? "You"
											: (headsetUserMap.get(headset.name) ?? headset.name)
									}
									mixBus={mixBus}
									channel={headset.micInput}
									value={faderValues[mixBus]?.[headset.micInput]}
									onChange={(float) => handleFaderChange(float, mixBus, headset.micInput)}
									colour={headset.colour}
									headset={headset}
									fakeDisabled={!headsetUserMap.get(headset.name)}
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
};

function useAudioDebounce(value: number[][], delay?: number) {
	const previousValue = usePrevious(value);
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		if (debouncedValue.length === 0) {
			setDebouncedValue(value);
		}

		let timer: string | number | NodeJS.Timeout | undefined;
		if (!equal(value, previousValue)) {
			if (value && debouncedValue) {
				console.log(
					JSON.stringify(value),
					JSON.stringify(debouncedValue),
					JSON.stringify(value) === JSON.stringify(debouncedValue),
				);
			}
			console.log("Updating timer");
			timer = setTimeout(() => setDebouncedValue(value), delay ?? 500);
		}

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay, debouncedValue, previousValue]);

	return debouncedValue;
}
