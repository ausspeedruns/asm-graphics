import type { ReactNode } from "react";
import clsx from "clsx";
import type { AudioIndicator } from "@asm-graphics/types/Audio";

import type { RunDataTeam } from "@asm-graphics/types/RunData";

import { Nameplate } from "./nameplate";

import { runnerCustomDataSchema } from "../../shared/types/custom-data";

import DiscordLogo from "../media/icons/discord.svg";
import TwitterLogo from "../media/icons/twitter.svg";
import YouTubeLogo from "../media/icons/youtube.svg";
import styles from "./facecam.module.css";

const nodecgConfig = nodecg.bundleConfig;

interface FacecamProps {
	teams: RunDataTeam[] | undefined;
	noCam?: boolean;
	height?: number;
	width?: number;
	maxNameWidth?: number;
	dontAlternatePronouns?: boolean;
	pronounStartSide?: "left" | "right";
	icons?: React.ReactNode[];
	audioIndicator?: AudioIndicator;
	className?: string;
	style?: React.CSSProperties;
	verticalCoop?: boolean;
	nameplateColours?: string[];
}

const NAMEPLATE_HEIGHT = 41;
const NAMEPLATE_HEIGHT_VERTICAL = 69;

export const Facecam = (props: FacecamProps) => {
	const allRunnerNames: ReactNode[] = [];

	if (!props.teams) {
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
	} else if (props.teams.length > 1) {
		// Versus
		let alternatingPronounSides = props.pronounStartSide === "left";
		props.teams.forEach((team, i) => {
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
							(player) =>
								props.audioIndicator?.[
									typeof player.customData["microphone"] === "string"
										? player.customData["microphone"]
										: ""
								],
						)}
					/>,
				);
			} else {
				// Versus does not have a team name, display each name

				team.players.forEach((player) => {
					const correctMic =
						typeof player.customData["microphone"] === "string"
							? player.customData["microphone"]
							: undefined;
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
							speaking={correctMic ? props.audioIndicator?.[correctMic] : undefined}
						/>,
					);
					allRunnerNames.push(<div className={styles.runnerNameDivider} key={id + "-divider"} />);
				});
			}
		});

		void allRunnerNames.pop();
	} else {
		let alternatingPronounSides = props.pronounStartSide === "right";
		const team = props.teams[0];

		if (team) {
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
						speaking={
							props.audioIndicator?.[
								runnerCustomDataSchema.safeParse(team.players[0]?.customData ?? {}).data?.microphone ??
									""
							]
						}
					/>,
				);
				allRunnerNames.push(<div className={styles.runnerNameDivider} key={team.relayPlayerID + "-divider"} />);
			} else {
				// Single Player/Coop, display each player's name
				team.players.forEach((player, i) => {
					alternatingPronounSides = !alternatingPronounSides;
					if (props.dontAlternatePronouns) {
						alternatingPronounSides = props.pronounStartSide === "right";
					}

					let height = NAMEPLATE_HEIGHT;
					if (
						props.verticalCoop &&
						team.players.length > 1 &&
						team.players.some((player) => player.pronouns)
					) {
						height = NAMEPLATE_HEIGHT_VERTICAL;
					}

					allRunnerNames.push(
						<Nameplate
							icon={props.icons ? props.icons[i] : undefined}
							nameplateLeft={alternatingPronounSides}
							maxWidth={props.maxNameWidth}
							key={player.id}
							player={player}
							speaking={
								props.audioIndicator?.[
									runnerCustomDataSchema.safeParse(player.customData ?? {}).data?.microphone ?? ""
								]
							}
							vertical={team.players.length > 1 ? props.verticalCoop : false}
							style={{ height: height }}
						/>,
					);
					allRunnerNames.push(
						<div className={styles.runnerNameDivider} key={player.id + "-divider"} style={{ height }} />,
					);
				});
			}

			void allRunnerNames.pop();
		}
	}

	return (
		<div
			className={clsx(styles.facecamContainer, props.className)}
			style={Object.assign(
				{
					minHeight: props.height,
					height: props.height,
					width: props.width,
				},
				props.style,
			)}
		>
			<div className={styles.runnerArea}>{allRunnerNames}</div>
		</div>
	);
};
