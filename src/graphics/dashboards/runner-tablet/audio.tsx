import { RunDataActiveRun } from '@asm-graphics/types/RunData';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { AudioFader } from './audio-fader';
import { HEADSETS } from './headsets';

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
	gap: 8rem;
	padding: 2rem;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const RTAudio = (props: Props) => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const numberOfRunners = useMemo(
		() => runDataActiveRep?.teams.reduce((total, team) => total + team.players.length, 0) ?? 0,
		[runDataActiveRep],
	);

	const [selectedHeadset, setSelectedHeadset] = useState(HEADSETS[0].name);
	const selectedHeadsetObj = HEADSETS.find((headset) => headset.name === selectedHeadset);

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
							{headset.name}
						</HeadsetName>
					);
				})}
			</HeadsetSelectors>
			<MixingContainer
				style={{ borderColor: selectedHeadsetObj?.colour, background: `${selectedHeadsetObj?.colour}22` }}>
				{[...Array(numberOfRunners).keys()].map((number) => {
					return (
						<AudioFader
							key={number}
							label={`Game ${number}`}
							mixBus={selectedHeadsetObj?.mixBus ?? 11}
							channel={9 + number}
						/>
					);
				})}
				{HEADSETS.map((headset) => {
					return (
						<AudioFader
							key={headset.name}
							label={headset.name}
							mixBus={selectedHeadsetObj?.mixBus ?? 11}
							channel={headset.channel}
						/>
					);
				})}
			</MixingContainer>
		</RTAudioContainer>
	);
};
