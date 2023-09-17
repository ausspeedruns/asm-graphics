import React, { useState } from "react";
import styled from "styled-components";
import { useReplicant } from "use-nodecg";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Commentator } from "@asm-graphics/types/OverlayProps";
import { HEADSETS } from "./headsets";
import { EditUserDialog } from "./edit-user-dialog";

const RTNamesContainer = styled.div`
	height: 100%;
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
`;

const Data = styled.div`
	display: grid;
	grid-template-columns: min-content auto;
	gap: 0.5rem 1rem;
	align-items: center;
	justify-content: center;

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
	padding-bottom: 75px;
`;

const NameRow = styled.div`
	display: flex;
	margin: 1rem 0;
	font-size: 2rem;
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

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const RTNames: React.FC<Props> = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const [commentatorsRep] = useReplicant<Commentator[]>("commentators", []);
	const [isEditUserOpen, setIsEditUserOpen] = useState(true);
	const [_dialogRunner, setDialogRunner] = useState<Commentator | undefined>(undefined);

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
				};
			}),
		),
		...commentatorsRep,
	];

	function handleDialogCancel() {
		setIsEditUserOpen(false);
	}

	function openEditUserDialog(username?: string) {
		setDialogRunner(getRunnerData(username));
		setIsEditUserOpen(true);
	}

	function getRunnerData(username?: string): Commentator {
		if (!username)
			return {
				id: "",
				name: "",
				pronouns: "",
				teamId: "",
				twitch: "",
			};

		// See if runner is on couch
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
						<NameRow key={commentator.id}>
							{commentator.microphone && commentatorHeadset(commentator.microphone)}
							{commentator.name}
							{commentator.pronouns && `[${commentator.pronouns}]`}
							{commentator.twitch}
							<button onClick={() => openEditUserDialog(commentator.name)}>Edit</button>
						</NameRow>
					);
				})}
			</NameInputs>
			<EditUserDialog open={isEditUserOpen} onClose={handleDialogCancel} />
		</RTNamesContainer>
	);
};
