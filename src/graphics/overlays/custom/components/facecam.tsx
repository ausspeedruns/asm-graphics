import type { ReactNode } from "react";
import styled from "@emotion/styled";
import { useNode } from "@craftjs/core";

import { Nameplate } from "../../../elements/nameplate";

import { useOverlayStore } from "../../../stores/overlay-store";
import NumberField from "../../../elements/number-field";
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

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
	pronounsStartSide?: "left" | "right";
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
	const {
		connectors: { connect, drag },
	} = useNode();

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
		let alternatingPronounSides = props.pronounsStartSide === "left";
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
						alternatingPronounSides = props.pronounsStartSide === "left";
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
		let alternatingPronounSides = props.pronounsStartSide === "right";
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
					alternatingPronounSides = props.pronounsStartSide === "right";
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
			ref={(ref) => {
				if (ref) {
					connect(drag(ref));
				}
			}}
		>
			<RunnerArea>{allRunnerNames}</RunnerArea>
		</FacecamContainer>
	);
};

function FacecamSettings() {
	const {
		actions: { setProp },
		height,
		pronounsStartSide,
	} = useNode((node) => ({
		height: node.data.props["height"],
		pronounsStartSide: node.data.props["pronounsStartSide"],
	}));

	return (
		<div>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Typography variant="caption">Height</Typography>
				<NumberField value={height} onValueChange={(value) => setProp((props) => (props.height = value))} />
			</Box>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
				<Typography variant="caption">Pronouns Start Side</Typography>
				<ToggleButtonGroup
					value={pronounsStartSide ?? "right"}
					exclusive
					onChange={(_e, value: "left" | "right" | null) => {
						if (!value) {
							return;
						}
						setProp((props: FacecamProps) => (props.pronounsStartSide = value));
					}}
				>
					<ToggleButton value="left">Left</ToggleButton>
					<ToggleButton value="right">Right</ToggleButton>
				</ToggleButtonGroup>
			</Box>
		</div>
	);
}

Facecam.craft = {
	displayName: "Facecam",
	props: {
		height: 200,
		pronounsStartSide: "right",
	},
	related: {
		settings: FacecamSettings,
	},
};
