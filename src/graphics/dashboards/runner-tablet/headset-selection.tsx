import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import Mario from "../../media/runner-tablet/mario.png";
import Sonic from "../../media/runner-tablet/sonic.png";
import Pikachu from "../../media/runner-tablet/pikachu.png";
import Link from "../../media/runner-tablet/link.png";
import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData.js";
import { useReplicant } from "@nodecg/react-hooks";
import { type Headset, Headsets } from "../../../shared/audio-data.js";
import styles from "./headset-selection.module.css";

interface Props {
	className?: string;
	style?: React.CSSProperties;
	close?: () => void;
}

export const RTSelection = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });

	const [runnerIndex, setRunnerIndex] = useState(0);
	const [headsetSelection, setHeadsetSelection] = useState<string[]>([]);
	const runners = useMemo<RunDataPlayer[]>(() => {
		return (runDataActiveRep?.teams ?? []).flatMap((team) =>
			team.players.map((player) => {
				return {
					id: player.id,
					name: player.name,
					pronouns: player.pronouns,
					social: {
						twitch: player.social.twitch,
					},
					teamID: player.teamID,
					customData: {
						microphone: player.customData["microphone"] ?? "",
					},
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
				const runner = runners[i];

				if (!runner) return;

				void nodecg.sendMessage("update-commentator", {
					id: runner.id,
					name: runner.name,
					pronouns: runner.pronouns,
					microphone: headset,
					twitch: runner.social?.twitch,
					tag: typeof runner.customData?.["tag"] === "string" ? runner.customData?.["tag"] : "",
				});
			});

			if (props.close) {
				props.close();
			}
		}
	}, [headsetSelection, props, runnerIndex, runners]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (
				runners.length == 0 ||
				(headsetSelection.length == runners.length && !headsetSelection.some((headset) => headset === ""))
			) {
				if (props.close) {
					props.close();
				}
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [headsetSelection, props, runners]);

	// useEffect(() => {
	// 	setHeadsetSelection(runners.filter((runner) => runner.isRunner)?.map((runner) => runner.microphone ?? ""));
	// }, [runners]);

	return (
		<div className={clsx(styles.rtSelectionContainer, props.className)} style={props.style}>
			<div className={styles.selectionInstructions}>
				<div style={{ width: "96%", position: "absolute" }}>
					<button className={styles.skipButton} onClick={() => setRunnerIndex(runnerIndex + 1)}>Skip →</button>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						height: "100%",
					}}
				>
					<div className={styles.runnerName}>
						{runners[runnerIndex]?.name}{" "}
						{runners[runnerIndex]?.pronouns && `[${runners[runnerIndex].pronouns?.toUpperCase()}]`}
					</div>
					<div className={styles.instructions}>Choose your headset!</div>
				</div>
			</div>
			<div className={styles.headsetContainers}>
				{Headsets.filter((headset) => headset.name !== "NONE" && headset.name !== "Host").map((headset) => {
					return (
						<HeadsetButton
							key={headset.name}
							headset={headset}
							// recommended={headset.name === sortedHeadsetUsage[headsetSelection.length - (headsetSelection.length >= 2 ? 2 : 0)][0]}
							owner={
								headsetSelection.indexOf(headset.name) >= 0
									? runners[headsetSelection.indexOf(headset.name)]?.name
									: undefined
							}
							onClick={() => handleSelection(headset.name)}
						/>
					);
				})}
			</div>
		</div>
	);
};

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
		<div
			className={clsx(styles.headsetButtonSelector, Boolean(props.owner) && styles.taken)}
			style={{ background: props.headset.colour, color: props.headset.textColour }}
			onClick={props.onClick}
		>
			<div className={styles.headsetInformation}>
				<div className={styles.headsetName}>{headsetCodename}</div>
				<div className={styles.headsetColour}>{headsetColour}</div>
				{(props.recommended || props.owner) && (
					<div className={styles.recommended}>{props.owner ? props.owner : "Recommended"}</div>
				)}
			</div>
			{HeadsetImageMap[props.headset.name] && <img className={styles.headsetImage} src={HeadsetImageMap[props.headset.name]} />}
		</div>
	);
};
