import React, { useEffect, useMemo, useState } from "react";
import { Commentator } from "@asm-graphics/types/OverlayProps";
import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import styled from "styled-components";
import { useReplicant } from "use-nodecg";
import { AudioFader } from "./audio-fader";
import { HEADSETS, Host } from "./headsets";
import _ from "lodash";
import usePrevious from "../../../hooks/usePrevious";
import { FitText } from "../../elements/fit-text";

const RTAudioContainer = styled.div`
	display: flex;
`;

const HeadsetSelectorContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	width: 300px;
`;

const BigName = styled(FitText)`
	font-size: 50px;
	font-weight: bold;
	max-width: 100%;
	margin-top: 16px;
	white-space: nowrap;
	flex-grow: 1;
`;

const HeadsetName = styled.button`
	all: unset;
	flex-grow: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 32px;
	width: 100%;
	text-align: center;
`;

const MixingScrollable = styled.div`
	width: 100%;
	flex-grow: 1;
	height: 720px;
	overflow: scroll;
	overflow-y: scroll;
`;

const MixingContainer = styled.div`
	width: 100%;
	flex-grow: 1;
	margin: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	padding-top: 8px;
	padding-bottom: 48px;
`;

const CategoryName = styled.span`
	font-weight: bold;
	width: 93%;
	font-size: 2rem;
	margin-top: 1.5rem;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const RTAudio = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const [gameAudioNamesRep] = useReplicant<string[]>("game-audio-names", []);
	const [couchNamesRep] = useReplicant<Commentator[]>("commentators", []);
	const [hostRep] = useReplicant<Commentator | undefined>("host", undefined);
	const [busFadersRep] = useReplicant<number[][]>("x32:busFaders", []);

	const [selectedHeadset, setSelectedHeadset] = useState(HEADSETS[0].name);
	const [faderValues, setFaderValues] = useState<number[][]>([]);
	const debouncedFadersRep = useAudioDebounce(busFadersRep, 500);

	const headsetUserMap = useMemo(() => {
		const map = new Map();
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
	const sortedHeadsets = useMemo(() => {
		let selectedHeadsetArray = [];
		let headsetsWithUser = [];
		let headsetsWithoutUser = [];

		for (let headset of HEADSETS) {
			if (headset.name === selectedHeadset) {
				selectedHeadsetArray.push(headset);
			} else if (headsetUserMap.has(headset.name)) {
				headsetsWithUser.push(headset);
			} else if (headset.name != "Host") {
				headsetsWithoutUser.push(headset);
			}
		}

		return [...selectedHeadsetArray, ...headsetsWithUser, ...headsetsWithoutUser];
	}, [HEADSETS, selectedHeadset, headsetUserMap, hostRep]);

	useEffect(() => {
		setFaderValues(debouncedFadersRep);
	}, [debouncedFadersRep]);

	const selectedHeadsetObj = HEADSETS.find((headset) => headset.name === selectedHeadset);
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
		nodecg.sendMessage("x32:setFader", { float: float, channel: channel, mixBus: mixBus });
	};

	const editingText = `Editing ${headsetUser === selectedHeadsetObj?.name ? selectedHeadset : headsetUser ?? selectedHeadset}`;

	const gameAudio = gameAudioNamesRep
		.map((gameAudio, index) => ({ name: gameAudio, index }))
		.filter((gameAudio) => !!gameAudio.name);

	return (
		<RTAudioContainer className={props.className} style={props.style}>
			<HeadsetSelectorContainer style={{ backgroundColor: selectedHeadsetObj?.colour }}>
				{HEADSETS.filter((headset) => headset.name !== "Host" && headset.name !== "NONE").map((headset) => {
					return (
						<HeadsetName
							key={headset.name}
							style={{
								background: headset.colour,
								color: headset.textColour,
								fontWeight: selectedHeadset === headset.name ? "bold" : "",
								boxShadow: selectedHeadset === headset.name ? "" : "inset 0 0 20px 3px black",
							}}
							onClick={() => setSelectedHeadset(headset.name)}>
							<FitText
								style={{ maxWidth: "100%" }}
								text={headsetUserMap.get(headset.name) ?? headset.name}
							/>
						</HeadsetName>
					);
				})}
			</HeadsetSelectorContainer>
			<MixingScrollable>
				<MixingContainer style={{ background: `${selectedHeadsetObj?.colour}22` }}>
					<BigName text={editingText} />
					<CategoryName>Headphone Volume</CategoryName>
					<AudioFader
						mixBus={mixBus}
						channel={0}
						value={faderValues[mixBus]?.[0]}
						onChange={(float) => handleFaderChange(float, mixBus, 0)}
						colour={selectedHeadsetObj?.colour}
					/>
					<CategoryName>Game</CategoryName>
					{gameAudio.map((gameAudioName) => {
						return (
							<AudioFader
								key={gameAudioName.name}
								label={gameAudioName.name}
								mixBus={mixBus}
								channel={9 + gameAudioName.index * 2}
								value={faderValues[mixBus]?.[9 + gameAudioName.index + gameAudioName.index * 2]}
								onChange={(float) => handleFaderChange(float, mixBus, 9 + gameAudioName.index * 2)}
								colour={"#000"}
							/>
						);
					})}
					<CategoryName>Host</CategoryName>
					<AudioFader
						mixBus={mixBus}
						channel={Host.channel}
						value={faderValues[mixBus]?.[Host.channel]}
						onChange={(float) => handleFaderChange(float, mixBus, 0)}
						colour={"#000"}
					/>
					<CategoryName>Commentary</CategoryName>
					{sortedHeadsets
						.filter((headset) => headset.name !== "NONE")
						.map((headset) => {
							return (
								<AudioFader
									key={headset.name}
									label={
										headset.name === selectedHeadset
											? "You"
											: headsetUserMap.get(headset.name) ?? headset.name
									}
									mixBus={mixBus}
									channel={headset.channel}
									value={faderValues[mixBus]?.[headset.channel]}
									onChange={(float) => handleFaderChange(float, mixBus, headset.channel)}
									colour={headset.colour}
									headset={headset}
									fakeDisabled={!headsetUserMap.get(headset.name)}
								/>
							);
						})}
				</MixingContainer>
			</MixingScrollable>
		</RTAudioContainer>
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
		if (!_.isEqual(value, previousValue)) {
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
