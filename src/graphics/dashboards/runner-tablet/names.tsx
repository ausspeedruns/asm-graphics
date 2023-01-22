import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import type { RunDataActiveRun, RunDataPlayer } from '@asm-graphics/types/RunData';
import type { User } from '@asm-graphics/types/AusSpeedrunsWebsite';
import type { CouchPerson } from '@asm-graphics/types/OverlayProps';

const RTNamesContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
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
		font-size: 1.5rem;
	}

	span:nth-child(even) {
		font-weight: bold;
	}
`;

const NameInputs = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
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

const Save = styled.button`
	margin-left: 1rem;
	font-size: 2rem;
	font-weight: bold;
	border: 0;
	border-radius: 10px;

	/* background-size: 200% 100%; */
	background: linear-gradient(
			rgba(255, 0, 0, 1) 0%,
			rgba(255, 154, 0, 1) 10%,
			rgba(208, 222, 33, 1) 20%,
			rgba(79, 220, 74, 1) 30%,
			rgba(63, 218, 216, 1) 40%,
			rgba(47, 201, 226, 1) 50%,
			rgba(28, 127, 238, 1) 60%,
			rgba(95, 21, 242, 1) 70%,
			rgba(186, 12, 248, 1) 80%,
			rgba(251, 7, 217, 1) 90%,
			rgba(255, 0, 0, 1) 100%
		)
		0 0/100% 200%;
	animation: a 5s linear infinite;
	@keyframes a {
		to {
			background-position: 0% -200%;
		}
	}
`;

function generateRunnerLabels(noOfRunners: number, noOfNames = 4) {
	return [...Array(noOfNames)].map((_, i) => {
		if (i < noOfRunners) {
			return `Runner ${i + 1}`;
		} else {
			return `Com ${i - noOfRunners + 1}`;
		}
	});
}

const PRONOUN_OPTIONS = [
	'He/Him',
	'She/Her',
	'They/Them',
	'He/They',
	'She/They',
	'They/He',
	'They/She',
	'Any/All',
	'Other',
];

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

const HEADSETS = [
	{ name: 'Mario Red', colour: '#f00', textColour: '#fff' },
	{ name: 'Sonic Blue', colour: '#00f', textColour: '#fff' },
	{ name: 'Pikachu Yellow', colour: '#ff0', textColour: '#000' },
	{ name: 'Link Green', colour: '#006400', textColour: '#fff' },
] as const;

export const RTNames: React.FC<Props> = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [allUsersRep] = useReplicant<User[], User[]>('all-usernames', []);
	const [couchNamesRep] = useReplicant<CouchPerson[], CouchPerson[]>('couch-names', []);
	const allUsernames = useMemo(() => allUsersRep.map((user) => user.username), [allUsersRep]);
	const numberOfRunners = useMemo(
		() => runDataActiveRep?.teams.reduce((total, team) => total + team.players.length, 0) ?? 0,
		[runDataActiveRep],
	);

	const [rawPlayerData, setRawPlayerData] = useState<RunDataPlayer[]>([]);
	const [nameValues, setNameValues] = useState<string[]>([]);
	const [pronounValues, setPronounValues] = useState<string[]>([]);
	const [needToSave, setNeedToSave] = useState<boolean[]>([]);
	const [teamIds, setTeamId] = useState<string[]>([]);

	const runnerLabels = generateRunnerLabels(numberOfRunners, nameValues.length);

	// Fill runner names when run changes
	useEffect(() => {
		if (runDataActiveRep) {
			const names: string[] = [];
			const pronouns: string[] = [];
			const runnerData: RunDataPlayer[] = [];
			const teamIdMutable: string[] = [];

			runDataActiveRep.teams.forEach((team) => {
				team.players.forEach((player) => {
					names.push(player.name);
					pronouns.push(player.pronouns ?? '');
					runnerData.push(player);
					teamIdMutable.push(team.id);
				});
			});

			couchNamesRep.forEach((person) => {
				if (person.host) return;
				names.push(person.name);
				pronouns.push(person.pronouns);
			});

			while (names.length < HEADSETS.length) {
				names.push('');
				pronouns.push('');
			}

			setNameValues(names);
			setPronounValues(pronouns);
			setNeedToSave([]);
			setRawPlayerData(runnerData);
			setTeamId(teamIdMutable);
		}
	}, [runDataActiveRep, couchNamesRep]);

	// Autofill pronouns when user found when typing
	useEffect(() => {
		nameValues.forEach((name, index) => {
			const foundUser = allUsersRep.find((user) => user.username === name);
			if (foundUser) {
				setPronounValues((prevPronounValues) => {
					if (prevPronounValues[index]) return prevPronounValues;
					const newPronounValues = [...prevPronounValues];
					newPronounValues[index] = foundUser?.pronouns ?? '';
					return newPronounValues;
				});
			}
		});
	}, [nameValues, allUsernames, allUsersRep]);

	return (
		<RTNamesContainer className={props.className} style={props.style}>
			<RunInfo>
				<TechWarning>If any data is wrong please let Tech know</TechWarning>
				<Data>
					<span>Game</span>
					<span>{runDataActiveRep?.game ?? 'UNKNOWN, PLEASE LET TECH KNOW'}</span>
					<span>Category</span>
					<span>{runDataActiveRep?.category ?? 'UNKNOWN, PLEASE LET TECH KNOW'}</span>
					<span>Estimate</span>
					<span>{runDataActiveRep?.estimate ?? 'UNKNOWN, PLEASE LET TECH KNOW'}</span>
					<span>Console</span>
					<span>{runDataActiveRep?.system ?? 'UNKNOWN, PLEASE LET TECH KNOW'}</span>
					<span>Release Year</span>
					<span>{runDataActiveRep?.release ?? 'UNKNOWN, PLEASE LET TECH KNOW'}</span>
				</Data>
			</RunInfo>
			<NameInputs>
				{HEADSETS.map((headset, index) => {
					if (nameValues[index] === undefined || !runDataActiveRep) return;

					const setSave = (value = true) => {
						setNeedToSave((prevSaveValues) => {
							const newSaveValues = [...prevSaveValues];
							newSaveValues[index] = value;
							return newSaveValues;
						});
					};

					const setName = (newName: string) => {
						setNameValues((prevNameValues) => {
							const newNameValues = [...prevNameValues];
							newNameValues[index] = newName;
							setSave();
							return newNameValues;
						});
					};

					const setPronouns = (newPronouns: string) => {
						setPronounValues((prevPronounValues) => {
							const newPronounValues = [...prevPronounValues];
							newPronounValues[index] = newPronouns;
							setSave();
							return newPronounValues;
						});
					};

					const savePerson = () => {
						setSave(false);

						if (index < numberOfRunners) {
							// Runner
							// Find team index
							const teamIndex = runDataActiveRep.teams.findIndex((team) => team.id === teamIds[index]);
							// Find player index
							const playerIndex = runDataActiveRep.teams[teamIndex].players.findIndex(
								(player) => player.id === rawPlayerData[index].id,
							);
							// Update run data
							if (playerIndex >= 0) {
								let newRunData = { ...runDataActiveRep };
								newRunData.teams[teamIndex].players[playerIndex].name = nameValues[index];
								newRunData.teams[teamIndex].players[playerIndex].pronouns = pronounValues[index];
								newRunData.teams[teamIndex].players[playerIndex].customData = {
									...newRunData.teams[teamIndex].players[playerIndex].customData,
									microphone: headset.name,
								};

								// Send to update data
								nodecg.sendMessageToBundle('modifyRun', 'nodecg-speedcontrol', { runData: newRunData });
							}
						} else {
							// Commentator
							nodecg.sendMessage('rename-couch', {
								id: headset.name,
								name: nameValues[index],
								pronouns: pronounValues[index],
								microphone: headset.name,
							} as CouchPerson);
						}
					};

					return (
						<NameRow key={index}>
							<HeadsetName
								style={{
									background: headset.colour,
									color: headset.textColour,
								}}>
								{headset.name}
							</HeadsetName>
							<Autocomplete
								style={{ minWidth: '40vw', marginRight: '5vw', fontSize: '2rem !important' }}
								freeSolo
								options={allUsernames}
								inputValue={nameValues[index]}
								onInputChange={(_, newVal) => setName(newVal)}
								renderInput={(params) => (
									<TextField
										{...params}
										label={`${runnerLabels[index]} Name`}
										InputProps={{ ...params.InputProps, style: { fontSize: '2rem' } }}
									/>
								)}
							/>
							<Autocomplete
								style={{ minWidth: '30vw', fontSize: '2rem' }}
								freeSolo
								options={PRONOUN_OPTIONS}
								inputValue={pronounValues[index]}
								onInputChange={(_, newVal) => setPronouns(newVal)}
								renderInput={(params) => (
									<TextField
										{...params}
										label={`${runnerLabels[index]} Pronouns`}
										InputProps={{ ...params.InputProps, style: { fontSize: '2rem' } }}
									/>
								)}
							/>
							{needToSave[index] && <Save onClick={savePerson}>Save</Save>}
						</NameRow>
					);
				})}
			</NameInputs>
		</RTNamesContainer>
	);
};
