import React, { useState } from 'react';
import styled from 'styled-components';

import { TextField, Button } from '@material-ui/core';
import { CouchPerson } from '../../types/OverlayProps';
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
	const [host] = useReplicant<CouchPerson, CouchPerson>('host', { name: '', pronouns: '' });

	useEffect(() => {
		setHostName(host.name);
		setHostPronouns(host.pronouns);
	}, [host]);

	return (
		<HostNameContainer className={props.className} style={props.style}>
			<TextField
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
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Button size="small" onClick={() => setHostPronouns('He/Him')}>
					He/Him
				</Button>
				<Button size="small" onClick={() => setHostPronouns('She/Her')}>
					She/Her
				</Button>
				<Button
					size="small"
					onClick={() => setHostPronouns('They/Them')}>
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
