import { useState } from "react";
import clsx from "clsx";
import { useReplicant } from "@nodecg/react-hooks";

import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData";

import TwitchSVG from "../../media/icons/TwitchGlitchPurple.svg";
import { EditUserDialog } from "./edit-user-dialog";
import { Button } from "@mui/material";
import { Headsets } from "../../../shared/audio-data";
import styles from "./names.module.css";

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const RTNames: React.FC<Props> = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [commentatorsRep] = useReplicant("commentators");
	const [isEditUserOpen, setIsEditUserOpen] = useState(false);
	const [dialogRunner, setDialogRunner] = useState<RunDataPlayer | undefined>(undefined);

	const commentators: RunDataPlayer[] = [
		...(runDataActiveRep?.teams ?? []).flatMap((team) =>
			team.players.map((player) => {
				return {
					id: player.id,
					name: player.name,
					pronouns: player.pronouns,
					social: {
						twitch: player.social.twitch,
					},
					teamID: player.teamID,
					isRunner: true,
					customData: {
						microphone: player.customData["microphone"] ?? "",
					},
				};
			}),
		),
		...(commentatorsRep ?? []),
	];

	function handleDialogCancel() {
		setIsEditUserOpen(false);
	}

	function openEditUserDialog(id?: string) {
		setDialogRunner(getRunnerData(id));
		setIsEditUserOpen(true);
	}

	function getRunnerData(id?: string): RunDataPlayer {
		console.log(id);
		if (!id) {
			return {
				id: "",
				name: "",
				pronouns: "",
				teamID: "",
				social: {
					twitch: "",
				},
				customData: {
					microphone: "",
				},
			};
		}

		const runnerIndex =
			runDataActiveRep?.teams.flatMap((team) => team.players).findIndex((runners) => runners.id === id) ?? -1;

		if (runnerIndex !== -1) {
			const runner = runDataActiveRep?.teams.flatMap((team) => team.players)[runnerIndex];
			return {
				id: runner?.id ?? `runner-0${runnerIndex}`,
				name: runner?.name ?? "Unknown Runner",
				pronouns: runner?.pronouns,
				customData: {
					microphone: runner?.customData["microphone"] ?? "",
				},
				teamID: runner?.teamID ?? "",
				social: {
					twitch: runner?.social.twitch,
				},
			};
		}

		const commentator = commentators.find((commentator) => commentator.id === id);
		if (commentator) {
			return commentator;
		}

		return {
			id: "",
			name: "",
			pronouns: "",
			teamID: "",
			social: {
				twitch: "",
			},
			customData: {
				microphone: "",
			},
		};
	}

	function CommentatorHeadset(props: { headset?: string }) {
		const headset = Headsets.find((headset) => headset.name == props.headset);

		if (headset) {
			return (
				<span
					className={styles.headsetName}
					style={{
						background: headset.colour,
						color: headset.textColour,
					}}
				>
					{headset.name}
				</span>
			);
		}

		return <></>;
	}

	return (
		<div className={clsx(styles.rtNamesContainer, props.className)} style={props.style}>
			<div>
				<h3 className={styles.techWarning}>If any data is wrong please let Tech know</h3>
				<div className={styles.data}>
					<span>Game</span>
					<span>{runDataActiveRep?.game?.replaceAll("\\n", " ") ?? "UNKNOWN, PLEASE LET TECH KNOW"}</span>
					<span>Category</span>
					<span>{runDataActiveRep?.category?.replaceAll("\\n", " ") ?? "UNKNOWN, PLEASE LET TECH KNOW"}</span>
					<span>Estimate</span>
					<span>{runDataActiveRep?.estimate ?? "UNKNOWN, PLEASE LET TECH KNOW"}</span>
					<span>Console</span>
					<span>{runDataActiveRep?.system ?? "UNKNOWN, PLEASE LET TECH KNOW"}</span>
					<span>Release Year</span>
					<span>{runDataActiveRep?.release ?? "UNKNOWN, PLEASE LET TECH KNOW"}</span>
				</div>
			</div>
			<div className={styles.nameInputs}>
				{commentators.map((commentator) => {
					return (
						<div className={styles.nameRow} key={commentator.id}>
							{typeof commentator.customData["microphone"] === "string" && (
								<CommentatorHeadset headset={commentator.customData["microphone"]} />
							)}
							{commentator.name}
							{commentator.pronouns && <div className={styles.runnerPronouns}>[{commentator.pronouns}]</div>}
							{commentator.social.twitch && (
								<div className={styles.runnerTwitch}>
									<img className={styles.twitchImg} src={TwitchSVG} />
									{commentator.social.twitch}
								</div>
							)}
							<Button className={styles.editButton} variant="outlined" onClick={() => openEditUserDialog(commentator.id)}>
								Edit
							</Button>
							{!commentator.customData["microphone"] && <AnnoyingSetHeadsetNotification />}
						</div>
					);
				})}
			</div>
			<Button className={styles.addCommentatorButton} variant="contained" onClick={() => openEditUserDialog()}>
				Add Commentator
			</Button>
			<EditUserDialog open={isEditUserOpen} onClose={handleDialogCancel} commentator={dialogRunner} />
		</div>
	);
};

const AnnoyingSetHeadsetNotification = () => {
	return <span className={styles.rainbowText}>⇦ Set your Headset!</span>;
};
