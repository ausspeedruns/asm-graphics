import React, { useEffect, useMemo, useState } from 'react';
import { CouchPerson } from '@asm-graphics/types/OverlayProps';
import { RunDataActiveRun } from '@asm-graphics/types/RunData';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { AudioFader } from './audio-fader';
import { HEADSETS } from './headsets';
// import useDebounce from '../../../hooks/useDebounce';

const RTAudioContainer = styled.div``;

const HeadsetSelectors = styled.div`
	display: flex;
	justify-content: center;
	gap: 2rem;
	margin-top: 2rem;
`;

const HeadsetName = styled.button`
	all: unset;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	border-radius: 20px;
	width: 4rem;
	padding: 1rem;
	text-align: center;
`;

const MixingContainer = styled.div`
	width: 80%;
	height: 60vh;
	border: 5px solid black;
	border-radius: 20px;
	margin: auto;
	margin-top: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4vw;
	padding: 1vw;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const RTAudio = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [couchNamesRep] = useReplicant<CouchPerson[], CouchPerson[]>('couch-names', []);
	const [busFadersRep] = useReplicant<number[][], number[][]>('x32:busFaders', []);
	const [faderValues, setFaderValues] = useState<number[][]>([]);
	// const debouncedFadersRep = useDebounce(busFadersRep, 100);

	const numberOfRunners = useMemo(
		() => runDataActiveRep?.teams.reduce((total, team) => total + team.players.length, 0) ?? 0,
		[runDataActiveRep],
	);
	const headsetUserMap = useMemo(() => {
		const map = new Map(HEADSETS.map((headset) => [headset.name, headset.name]));
		runDataActiveRep?.teams.map((team) => {
			team.players.map((player) => {
				if ('microphone' in player.customData) map.set(player.customData.microphone, player.name);
			});
		});

		couchNamesRep.map((couch) => {
			if (couch.microphone) map.set(couch.microphone, couch.name);
		});

		return map;
	}, [runDataActiveRep, couchNamesRep]);

	useEffect(() => {
		setFaderValues(busFadersRep);
	}, [busFadersRep]);

	const [selectedHeadset, setSelectedHeadset] = useState(HEADSETS[0].name);
	const selectedHeadsetObj = HEADSETS.find((headset) => headset.name === selectedHeadset);

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
		nodecg.sendMessage('x32:setFader', { float: float, channel: channel, mixBus: mixBus });
	};

	return (
		<RTAudioContainer className={props.className} style={props.style}>
			<HeadsetSelectors>
				{HEADSETS.filter((headset) => headset.name !== 'Host').map((headset) => {
					return (
						<HeadsetName
							key={headset.name}
							style={{
								background: headset.colour,
								color: headset.textColour,
								fontWeight: selectedHeadset === headset.name ? 'bold' : '',
							}}
							onClick={() => setSelectedHeadset(headset.name)}>
							{headsetUserMap.get(headset.name) ?? headset.name}
						</HeadsetName>
					);
				})}
			</HeadsetSelectors>
			<MixingContainer
				style={{ borderColor: selectedHeadsetObj?.colour, background: `${selectedHeadsetObj?.colour}22` }}>
				<AudioFader
					key={'MASTER'}
					label={`MASTER`}
					mixBus={mixBus}
					channel={0}
					style={{ marginRight: '2vw' }}
					value={faderValues[mixBus]?.[0]}
					onChange={(float) => handleFaderChange(float, mixBus, 0)}
				/>
				{[...Array(numberOfRunners).keys()].map((number) => {
					return (
						<AudioFader
							key={number}
							label={`Game ${number + 1}`}
							mixBus={mixBus}
							channel={9 + (number * 2)}
							value={faderValues[mixBus]?.[9 + number + (number * 2)]}
							onChange={(float) => handleFaderChange(float, mixBus, 9 + (number * 2))}
						/>
					);
				})}
				{HEADSETS.map((headset, i) => {
					return (
						<AudioFader
							key={headset.name}
							label={
								headset.name === selectedHeadset
									? 'You'
									: headsetUserMap.get(headset.name) ?? headset.name
							}
							mixBus={mixBus}
							channel={headset.channel}
							style={{ marginLeft: i === 0 ? '6rem' : '' }}
							value={faderValues[mixBus]?.[headset.channel]}
							onChange={(float) => handleFaderChange(float, mixBus, headset.channel)}
						/>
					);
				})}
			</MixingContainer>
		</RTAudioContainer>
	);
};
