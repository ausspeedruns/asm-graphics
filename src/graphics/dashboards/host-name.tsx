import React, { useState } from 'react';
import styled from 'styled-components';

import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { CouchPerson } from '../../types/OverlayProps';
import { useReplicant } from 'use-nodecg';
import { useEffect } from 'react';

const HostNameContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 8px;
`;

interface DACBOTMember {
	avatar: string;
	id: string;
	muted: boolean;
	name: string;
}

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const HostName: React.FC<Props> = (props: Props) => {
	const [hostName, setHostName] = useState('');
	const [hostPronouns, setHostPronouns] = useState('');
	const [hostDiscord, setHostDiscord] = useState('');
	const [host] = useReplicant<CouchPerson, CouchPerson>('host', { name: '', pronouns: '' });
	const [discordMembers] = useReplicant<DACBOTMember[], DACBOTMember[]>('memberList', [], {
		namespace: 'nodecg-dacbot',
	});

	useEffect(() => {
		setHostName(host.name);
		setHostPronouns(host.pronouns);
		setHostDiscord(host.discordID ?? '');
	}, [host]);

	return (
		<HostNameContainer className={props.className} style={props.style}>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ display: 'flex', gap: 4 }}>
					<TextField fullWidth label="Name" value={hostName} onChange={(e) => setHostName(e.target.value)} />
					<FormControl fullWidth>
						<InputLabel id="live-discord-user">Discord User</InputLabel>
						<Select
							labelId="live-discord-user"
							value={hostDiscord}
							onChange={(e) => setHostDiscord(e.target.value as string)}>
							<MenuItem value="">No user</MenuItem>
							{discordMembers?.map((user) => {
								return (
									<MenuItem key={user.id} value={user.id}>
										{user.name}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
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
						discordID: hostDiscord,
					} as CouchPerson)
				}>
				Update
			</Button>
		</HostNameContainer>
	);
};
