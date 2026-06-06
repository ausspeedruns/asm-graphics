import type { ReactNode } from "react";
import styled from "@emotion/styled";

import { Nameplate } from "../../../elements/nameplate";

import { useOverlayStore } from "../../../stores/overlay-store";

const nodecgConfig = nodecg.bundleConfig;

const FacecamContainer = styled.div`
	position: relative;
	height: 100%;
	width: 100%;
`;

const RunnerArea = styled.div`
	display: flex;
	width: 100%;
	position: absolute;
	bottom: 0;
`;

interface FacecamProps {
	noCam?: boolean;
	height?: number;
	width?: number;
	maxNameWidth?: number;
	dontAlternatePronouns?: boolean;
	pronounStartSide?: "left" | "right";
	icons?: React.ReactNode[];
	className?: string;
	style?: React.CSSProperties;
	verticalCoop?: boolean;
	nameplateColours?: string[];
}

const NAMEPLATE_HEIGHT = 41;
const NAMEPLATE_HEIGHT_VERTICAL = 69;

const RunnerNameDivider = styled.div`
	background: var(--sec);
	min-width: 2px;
	height: ${NAMEPLATE_HEIGHT}px;
`;

export const Facecam = (props: FacecamProps) => {
	const teams = useOverlayStore((state) => state.runData?.teams);
	const audioIndicator = useOverlayStore((state) => state.microphoneAudioIndicator);

	const allRunnerNames: ReactNode[] = [];

	if (!teams) {
		// Fallback
		allRunnerNames.push(
			<Nameplate
				icon={props.icons ? props.icons[0] : undefined}
				nameplateLeft={false}
				maxWidth={props.maxNameWidth}
				key={"No Player"}
				player={{
					name: nodecgConfig.graphql?.event ?? "AusSpeedruns",
					social: { twitch: "AusSpeedruns" },
					pronouns: nodecgConfig.graphql?.event,
					id: nodecgConfig.graphql?.event ?? "AusSpeedruns",
					teamID: nodecgConfig.graphql?.event ?? "AusSpeedruns",
					customData: {},
				}}
			/>,
		);
	} else if (teams.length > 1) {
		// Versus
		let alternatingPronounSides = props.pronounStartSide === "left";
		teams.forEach((team, i) => {
			let id: string;
			if (team.name) {
				// Versus has a team name
				id = team.id;
				allRunnerNames.push(
					<Nameplate
						icon={props.icons ? props.icons[i] : undefined}
						maxWidth={props.maxNameWidth}
						player={{
							id: team.id,
							teamID: team.id,
							name: team.name,
							customData: {},
							social: {},
						}}
						nameplateLeft={alternatingPronounSides}
						style={{
							fontSize: 25,
							backgroundColor: props.nameplateColours?.[i] ?? undefined,
						}}
						key={team.id}
						speaking={team.players.some(
							(player) => audioIndicator?.[player.customData["microphone"] ?? ""],
						)}
					/>,
				);
			} else {
				// Versus does not have a team name, display each name

				team.players.forEach((player) => {
					const correctMic = player.customData["microphone"];
					id = player.id;
					alternatingPronounSides = !alternatingPronounSides;
					if (props.dontAlternatePronouns) {
						alternatingPronounSides = props.pronounStartSide === "left";
					}
					allRunnerNames.push(
						<Nameplate
							icon={props.icons ? props.icons[i] : undefined}
							maxWidth={props.maxNameWidth}
							player={player}
							nameplateLeft={alternatingPronounSides}
							style={{
								fontSize: 25,
								backgroundColor: props.nameplateColours?.[i] ?? undefined,
							}}
							key={player.id}
							speaking={correctMic ? audioIndicator?.[correctMic] : undefined}
						/>,
					);
					allRunnerNames.push(<RunnerNameDivider key={id + "-divider"} />);
				});
			}
		});

		void allRunnerNames.pop();
	} else {
		let alternatingPronounSides = props.pronounStartSide === "right";
		const team = teams[0];

		if (!team) {
			return null;
		}

		if (team.relayPlayerID) {
			// Relay, display relay player name
			allRunnerNames.push(
				<Nameplate
					icon={props.icons ? props.icons[0] : undefined}
					maxWidth={props.maxNameWidth}
					player={team.players.find((player) => player.id === team.relayPlayerID)!}
					nameplateLeft={alternatingPronounSides}
					style={{
						fontSize: 25,
					}}
					key={team.relayPlayerID}
					speaking={audioIndicator?.[team.players[0]?.customData["microphone"] ?? ""]}
				/>,
			);
			allRunnerNames.push(<RunnerNameDivider key={team.relayPlayerID + "-divider"} />);
		} else {
			// Single Player/Coop, display each player's name
			team.players.forEach((player, i) => {
				alternatingPronounSides = !alternatingPronounSides;
				if (props.dontAlternatePronouns) {
					alternatingPronounSides = props.pronounStartSide === "right";
				}

				let height = NAMEPLATE_HEIGHT;
				if (props.verticalCoop && team.players.length > 1 && team.players.some((player) => player.pronouns)) {
					height = NAMEPLATE_HEIGHT_VERTICAL;
				}

				allRunnerNames.push(
					<Nameplate
						icon={props.icons ? props.icons[i] : undefined}
						nameplateLeft={alternatingPronounSides}
						maxWidth={props.maxNameWidth}
						key={player.id}
						player={player}
						speaking={audioIndicator?.[player.customData["microphone"] ?? ""]}
						vertical={team.players.length > 1 ? props.verticalCoop : false}
						style={{ height: height }}
					/>,
				);
				allRunnerNames.push(<RunnerNameDivider key={player.id + "-divider"} style={{ height: height }} />);
			});
		}

		void allRunnerNames.pop();
	}

	return (
		<FacecamContainer
			style={Object.assign(
				{
					minHeight: props.height,
					height: props.height,
					width: props.width,
				},
				props.style,
			)}
			className={props.className}
		>
			<RunnerArea>{allRunnerNames}</RunnerArea>
		</FacecamContainer>
	);
};
