import React, { useState } from 'react';
import styled from 'styled-components';

import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CouchInformation, CouchPerson } from '../../types/OverlayProps';
import { useReplicant } from 'use-nodecg';
import { useEffect } from 'react';

const HostNameContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 8px;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const HostName: React.FC<Props> = (props: Props) => {
	const [hostName, setHostName] = useState('');
	const [hostPronouns, setHostPronouns] = useState('');
	// const [hostDiscord, setHostDiscord] = useState('');
	const [couchRep] = useReplicant<CouchInformation, CouchInformation>('couch-names', { current: [], preview: [] });

	useEffect(() => {
		const host = couchRep?.current.find((couch) => couch.host);
		setHostName(host?.name ?? '');
		setHostPronouns(host?.pronouns ?? '');
		// setHostDiscord(host?.discordID ?? '');
	}, [couchRep]);

	return (
		<HostNameContainer className={props.className} style={props.style}>
			<TextField
				// style={{ flexShrink: 1 }}
				label="Name"
				value={hostName}
				onChange={(e) => setHostName(e.target.value)}
			/>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ display: 'flex', gap: 4 }}>
					<TextField
						style={{ flexShrink: 1 }}
						label="Pronouns"
						value={hostPronouns}
						onChange={(e) => setHostPronouns(e.target.value)}
					/>
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
