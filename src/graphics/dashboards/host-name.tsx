import React, { useState } from 'react';
import styled from 'styled-components';

import { TextField, Button } from '@mui/material';
import { CouchPerson } from '@asm-graphics/types/OverlayProps';
import { useReplicant } from 'use-nodecg';
import { useEffect } from 'react';

const HostNameContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 8px;
	height: 75%;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const HostName: React.FC<Props> = (props: Props) => {
	const [hostName, setHostName] = useState('');
	const [hostPronouns, setHostPronouns] = useState('');
	// const [hostDiscord, setHostDiscord] = useState('');
	const [couchRep] = useReplicant<CouchPerson[]>('couch-names', []);

	useEffect(() => {
		const host = couchRep.find((couch) => couch.host);
		setHostName(host?.name ?? '');
		setHostPronouns(host?.pronouns ?? '');
		// setHostDiscord(host?.discordID ?? '');
	}, [couchRep]);

	return (
		<HostNameContainer className={props.className} style={props.style}>
			<div style={{ display: 'flex', gap: 4 }}>
				<TextField
					// style={{ flexShrink: 1 }}
					label="Name"
					value={hostName}
					onChange={(e) => setHostName(e.target.value)}
				/>
				<TextField
					style={{ flexShrink: 1 }}
					label="Pronouns"
					value={hostPronouns}
					onChange={(e) => setHostPronouns(e.target.value)}
				/>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Button size="small" onClick={() => setHostPronouns('He/Him')}>
					He/Him
				</Button>
				<Button size="small" onClick={() => setHostPronouns('She/Her')}>
					She/Her
				</Button>
				<Button size="small" onClick={() => setHostPronouns('They/Them')}>
					They/Them
				</Button>
			</div>
			<Button
				variant="contained"
				onClick={() =>
					nodecg.sendMessage('update-hostname', {
						name: hostName,
						pronouns: hostPronouns,
					} as CouchPerson)
				}>
				Update
			</Button>
		</HostNameContainer>
	);
};
