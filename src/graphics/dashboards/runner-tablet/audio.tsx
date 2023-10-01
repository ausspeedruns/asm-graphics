import React, { useEffect, useMemo, useState } from "react";
import { Commentator } from "@asm-graphics/types/OverlayProps";
import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import styled from "styled-components";
import { useReplicant } from "use-nodecg";
import { AudioFader } from "./audio-fader";
import { HEADSETS } from "./headsets";
import _ from "lodash";
import usePrevious from "../../../hooks/usePrevious";
import { FitText } from "../../elements/fit-text";

const RTAudioContainer = styled.div``;

const HeadsetSelectorContainer = styled.div`
	padding: 8px;
	display: flex;
	justify-content: space-around;
	align-items: center;
`;

const BigName = styled(FitText)`
	font-size: 50px;
	font-weight: bold;
	max-width: 26%;
	padding-right: 16px;
	white-space: nowrap;
	flex-grow: 1;
`;

const HeadsetSelectors = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 16px;
	background: white;
	width: fit-content;
	padding: 8px;
	border-radius: 26px;
`;

const HeadsetName = styled.button`
	all: unset;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 32px;
	border-radius: 20px;
	width: 175px;
	padding: 1rem;
	text-align: center;
`;

const MixingContainer = styled.div`
	width: 100%;
	height: 560px;
	margin: auto;
	display: flex;
	align-items: flex-start;
	justify-content: space-around;
	padding-top: 8px;
	padding-bottom: 48px;
`;

const MixingDivide = styled.div`
	height: 120%;
	width: 5px;
	margin-top: -9px;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const RTAudio = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const [couchNamesRep] = useReplicant<Commentator[]>("commentators", []);
	// const [hostRep] = useReplicant<Commentator | undefined>("host", undefined);
	const [busFadersRep] = useReplicant<number[][]>("x32:busFaders", []);
	const [faderValues, setFaderValues] = useState<number[][]>([]);
	const debouncedFadersRep = useAudioDebounce(busFadersRep, 500);

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
		setFaderValues(debouncedFadersRep);
	}, [debouncedFadersRep]);

	const [selectedHeadset, setSelectedHeadset] = useState(HEADSETS[0].name);
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

	return (
		<RTAudioContainer className={props.className} style={props.style}>
			<HeadsetSelectorContainer style={{ backgroundColor: selectedHeadsetObj?.colour }}>
				<BigName
					style={{ color: selectedHeadsetObj?.textColour }}
					text={headsetUser === selectedHeadsetObj?.name ? selectedHeadset : headsetUser ?? selectedHeadset}
				/>
				<HeadsetSelectors>
					{HEADSETS.filter((headset) => headset.name !== "Host" && headset.name !== "NONE").map((headset) => {
						return (
							<HeadsetName
								key={headset.name}
								style={{
									background: headset.colour,
									color: headset.textColour,
									fontWeight: selectedHeadset === headset.name ? "bold" : "",
								}}
								onClick={() => setSelectedHeadset(headset.name)}>
								<FitText
									style={{ maxWidth: "100%" }}
									text={headsetUserMap.get(headset.name) ?? headset.name}
								/>
							</HeadsetName>
						);
					})}
				</HeadsetSelectors>
			</HeadsetSelectorContainer>
			<MixingContainer
				style={{ background: `${selectedHeadsetObj?.colour}22` }}>
				<AudioFader
					key={"MASTER"}
					label={"MASTER"}
					mixBus={mixBus}
					channel={0}
					value={faderValues[mixBus]?.[0]}
					onChange={(float) => handleFaderChange(float, mixBus, 0)}
					colour={selectedHeadsetObj?.colour}
				/>
				<MixingDivide style={{ background: selectedHeadsetObj?.colour }} />
				{[...Array(numberOfRunners).keys()].map((number) => {
					return (
						<AudioFader
							key={number}
							label={`Game ${number + 1}`}
							mixBus={mixBus}
							channel={9 + number * 2}
							value={faderValues[mixBus]?.[9 + number + number * 2]}
							onChange={(float) => handleFaderChange(float, mixBus, 9 + number * 2)}
							colour={selectedHeadsetObj?.colour}
						/>
					);
				})}
				<MixingDivide style={{ background: selectedHeadsetObj?.colour }} />
				{HEADSETS.filter((headset) => headset.name !== "NONE").map((headset) => {
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
							colour={selectedHeadsetObj?.colour}
							headset={headset}
						/>
					);
				})}
			</MixingContainer>
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
