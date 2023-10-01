import React, { useState } from "react";
import styled from "styled-components";
import { useReplicant } from "use-nodecg";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Commentator } from "@asm-graphics/types/OverlayProps";

import TwitchSVG from "../../media/TwitchGlitchPurple.svg";
import { HEADSETS } from "./headsets";
import { EditUserDialog } from "./edit-user-dialog";
import { Button } from "@mui/material";

const RTNamesContainer = styled.div`
	height: calc(100% - 96px);
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	padding-bottom: 48px;
`;

const RunInfo = styled.div`
	/* margin-bottom: 2rem; */
`;

const TechWarning = styled.h3`
	background: red;
	color: white;
	padding: 1rem;
	border-radius: 16px;
	text-align: center;
	margin: 0;
`;

const Data = styled.div`
	display: grid;
	grid-template-columns: min-content auto;
	gap: 0.5rem 1rem;
	align-items: center;
	justify-content: center;
	margin-top: 8px;

	span {
		white-space: nowrap;
		font-size: 1rem;
	}

	span:nth-child(even) {
		font-weight: bold;
	}
`;

const NameInputs = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

const NameRow = styled.div<{ isRunner?: boolean }>`
	display: flex;
	margin: 1rem 0;
	font-size: 2rem;
	align-items: center;
	${({ isRunner }) => (isRunner ? "font-weight: bold;" : "")}
`;

const HeadsetName = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	border-radius: 20px;
	margin-right: 1rem;
	width: 4rem;
	text-align: center;
`;

const RunnerPronouns = styled.div`
	margin-left: 8px;
	font-size: 1.5rem;
	font-style: italic;
`;

const RunnerTwitch = styled.div`
	display: flex;
	align-items: center;
	margin-left: 48px;
`;

const TwitchImg = styled.img`
	height: 2rem;
	width: auto;
	margin-right: 8px;
`;

const EditButton = styled(Button)`
	margin-left: 32px !important;
`;

const AddCommentatorButton = styled(Button)``;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const RTNames: React.FC<Props> = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const [commentatorsRep] = useReplicant<Commentator[]>("commentators", []);
	const [isEditUserOpen, setIsEditUserOpen] = useState(false);
	const [dialogRunner, setDialogRunner] = useState<Commentator | undefined>(undefined);

	const commentators: Commentator[] = [
		...(runDataActiveRep?.teams ?? []).flatMap((team) =>
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
		),
		...commentatorsRep,
	];

	function handleDialogCancel() {
		setIsEditUserOpen(false);
	}

	function openEditUserDialog(id?: string) {
		setDialogRunner(getRunnerData(id));
		setIsEditUserOpen(true);
	}

	function getRunnerData(id?: string): Commentator {
		console.log(id);
		if (!id) {
			return {
				id: "",
				name: "",
				pronouns: "",
				teamId: "",
				twitch: "",
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
				isRunner: true,
				microphone: runner?.customData.microphone,
				teamId: runner?.teamID,
				twitch: runner?.social.twitch,
			};
		}

		const commentatorIndex = commentators.findIndex((commentator) => commentator.id === id) ?? -1;
		console.log(commentatorIndex);
		if (commentatorIndex !== -1) {
			return commentators[commentatorIndex];
		}

		return {
			id: "",
			name: "",
			pronouns: "",
			teamId: "",
			twitch: "",
		};
	}

	function commentatorHeadset(comHeadset?: string) {
		const headset = HEADSETS.find((headset) => headset.name == comHeadset);

		if (headset) {
			return (
				<HeadsetName
					style={{
						background: headset.colour,
						color: headset.textColour,
					}}>
					{headset.name}
				</HeadsetName>
			);
		}

		return <></>;
	}

	return (
		<RTNamesContainer className={props.className} style={props.style}>
			<RunInfo>
				<TechWarning>If any data is wrong please let Tech know</TechWarning>
				<Data>
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
				</Data>
			</RunInfo>
			<NameInputs>
				{commentators.map((commentator) => {
					return (
						<NameRow isRunner={commentator.isRunner} key={commentator.id}>
							{commentator.microphone && commentatorHeadset(commentator.microphone)}
							{commentator.name}
							{commentator.pronouns && <RunnerPronouns>[{commentator.pronouns}]</RunnerPronouns>}
							{commentator.twitch && commentator.isRunner && (
								<RunnerTwitch>
									<TwitchImg src={TwitchSVG} />
									{commentator.twitch}
								</RunnerTwitch>
							)}
							<EditButton variant="outlined" onClick={() => openEditUserDialog(commentator.id)}>
								Edit
							</EditButton>
						</NameRow>
					);
				})}
			</NameInputs>
			<AddCommentatorButton variant="contained" onClick={() => openEditUserDialog()}>
				Add Commentator
			</AddCommentatorButton>
			<EditUserDialog open={isEditUserOpen} onClose={handleDialogCancel} commentator={dialogRunner} />
		</RTNamesContainer>
	);
};
