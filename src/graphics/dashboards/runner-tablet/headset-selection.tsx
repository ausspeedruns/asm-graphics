import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { HEADSETS, Headset } from "./headsets";

import Mario from "../../media/runner-tablet/mario.png";
import Sonic from "../../media/runner-tablet/sonic.png";
import Pikachu from "../../media/runner-tablet/pikachu.png";
import Link from "../../media/runner-tablet/link.png";
import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { useReplicant } from "use-nodecg";
import { Commentator } from "@asm-graphics/types/OverlayProps";

const RTSelectionContainer = styled.div`
	background-color: #cc7722;
	height: calc(100% - 96px);
	width: 100%;
	color: white;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

const SelectionInstructions = styled.div`
	display: flex;
	flex-direction: column;
	/* align-items: center;
	justify-content: space-between; */
	height: 20%;
	padding: 2%;
`;

const SkipButton = styled.button`
	float: right;
	background: #c72;
	font-size: 2rem;
	color: white;
	border: 0;
`;

const RunnerName = styled.div`
	text-align: center;
	font-size: 40px;
	font-weight: bold;
`;

const Instructions = styled.div`
	text-align: center;
	font-size: 40px;
	font-style: italic;
`;

const HeadsetContainers = styled.div`
	display: flex;
	width: 100%;
	height: 400px;
	flex-grow: 1;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	close?: () => void;
}

export const RTSelection = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const [headsetsUsed] = useReplicant<Record<string, number>>("headsets-used", {});

	const [runnerIndex, setRunnerIndex] = useState(0);
	const [headsetSelection, setHeadsetSelection] = useState<string[]>([]);
	const runners = useMemo<Commentator[]>(() => {
		return (runDataActiveRep?.teams ?? []).flatMap((team) =>
			team.players.map((player) => {
				return {
					id: player.id,
					name: player.name,
					pronouns: player.pronouns,
					twitch: player.social.twitch,
					teamId: player.teamID,
					isRunner: true,
					microphone: player.customData.microphone,
				};
			}),
		);
	}, [runDataActiveRep?.teams]);

	function handleSelection(headset: string) {
		setRunnerIndex(runnerIndex + 1);
		setHeadsetSelection([...headsetSelection, headset]);
	}

	useEffect(() => {
		if (runnerIndex >= runners.length && runners.length != 0) {
			console.log(runnerIndex, runners.length, runnerIndex >= runners.length);
			// Submit to the authorities
			headsetSelection.forEach((headset, i) => {
				nodecg.sendMessage("update-commentator", {
					...runners[i],
					microphone: headset,
				});
			});

			if (props.close) {
				props.close();
			}
		}
	}, [headsetSelection, props, runnerIndex, runners]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (runners.length == 0 || headsetSelection.length == runners.length) {
				if (props.close) {
					props.close();
				}
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [headsetSelection.length, props, runners.length]);

	useEffect(() => {
		setHeadsetSelection(runners.filter((runner) => runner.isRunner)?.map((runner) => runner.microphone ?? ""));
	}, [runners]);

	const allHeadsetUsage: Record<string, number> = HEADSETS.reduce((all, headset) => {
		if (!(headset.name in all)) {
			all[headset.name] = 0;
		}

		return all;
	}, headsetsUsed);
	const sortedHeadsetUsage = Object.entries(allHeadsetUsage).sort(
		([_keyA, valueA], [_keyB, valueB]) => valueA - valueB,
	);

	return (
		<RTSelectionContainer className={props.className} style={props.style}>
			<SelectionInstructions>
				<div style={{ width: "96%", position: "absolute" }}>
					<SkipButton onClick={() => setRunnerIndex(runnerIndex + 1)}>Skip →</SkipButton>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						height: "100%",
					}}>
					<RunnerName>
						{runners[runnerIndex]?.name}{" "}
						{runners[runnerIndex]?.pronouns && `[${runners[runnerIndex].pronouns?.toUpperCase()}]`}
					</RunnerName>
					<Instructions>Choose your headset!</Instructions>
				</div>
			</SelectionInstructions>
			<HeadsetContainers>
				{HEADSETS.filter((headset) => headset.name !== "NONE" && headset.name !== "Host").map((headset) => {
					return (
						<HeadsetButton
							key={headset.name}
							headset={headset}
							recommended={headset.name === sortedHeadsetUsage[headsetSelection.length][0]}
							owner={
								headsetSelection.indexOf(headset.name) >= 0
									? runners[headsetSelection.indexOf(headset.name)].name
									: undefined
							}
							onClick={() => handleSelection(headset.name)}
						/>
					);
				})}
			</HeadsetContainers>
		</RTSelectionContainer>
	);
};

const HeadsetButtonSelector = styled.div<{ taken: boolean }>`
	height: 100%;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	border: 3px white solid;
	border-top: 6px white solid;
	border-bottom: 0;
	transform: ${({ taken }) => (taken ? "translateY(+100px)" : "")};
	opacity: ${({ taken }) => (taken ? "40%" : "")};
	width: 100%;

	&:first-of-type {
		border-left: 6px white solid;
	}

	&:last-of-type {
		border-right: 6px white solid;
	}
`;

const HeadsetInformation = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const HeadsetName = styled.div`
	font-size: 50px;
`;

const HeadsetColour = styled.div`
	font-size: 50px;
	font-weight: bold;
`;

const Recommended = styled.div`
	font-weight: bold;
	font-style: italic;
`;

const HeadsetImage = styled.img`
	/* margin-bottom: -100px; */
	width: 80%;
	height: 50%;
	object-fit: contain;
`;

const HeadsetImageMap: Record<string, any> = {
	"Mario Red": Mario,
	"Sonic Blue": Sonic,
	"Pikachu Yellow": Pikachu,
	"Link Green": Link,
};

interface HeadsetButtonProps {
	headset: Headset;
	recommended?: boolean;
	owner?: string;
	onClick: () => void;
}

const HeadsetButton = (props: HeadsetButtonProps) => {
	const [headsetCodename, headsetColour] = props.headset.name.split(" ");

	return (
		<HeadsetButtonSelector
			taken={Boolean(props.owner)}
			style={{ background: props.headset.colour, color: props.headset.textColour }}
			onClick={props.onClick}>
			<HeadsetInformation>
				<HeadsetName>{headsetCodename}</HeadsetName>
				<HeadsetColour>{headsetColour}</HeadsetColour>
				{(props.recommended || props.owner) && (
					<Recommended>{props.owner ? props.owner : "Recommended"}</Recommended>
				)}
			</HeadsetInformation>
			{HeadsetImageMap[props.headset.name] && <HeadsetImage src={HeadsetImageMap[props.headset.name]} />}
		</HeadsetButtonSelector>
	);
};
