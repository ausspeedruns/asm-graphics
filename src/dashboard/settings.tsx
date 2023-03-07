import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';

import {
	Button,
	TextField,
	ThemeProvider,
} from '@mui/material';
import { darkTheme } from './theme';
import { useReplicant } from 'use-nodecg';
import useDebounce from '../hooks/useDebounce';

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin: 8px 0;
`;

export const Settings: React.FC = () => {
	const [creditsNameRep, setCreditsNameRep] = useReplicant<
		{ name: string; title: string },
		{ name: string; title: string }
	>('credits-name', { name: '', title: '' });
	// const debouncedCreditsName = useDebounce(creditsNameRep);

	return (
		<ThemeProvider theme={darkTheme}>
			<Button variant="contained" fullWidth onClick={() => nodecg.sendMessage('start-credits')}>
				Run Credits
			</Button>
			<Row>
				<TextField
					fullWidth
					label="Credits Name"
					value={creditsNameRep.name}
					onChange={(e) => setCreditsNameRep({ ...creditsNameRep, name: e.target.value })}
				/>
				<TextField
					fullWidth
					label="Credits Title"
					value={creditsNameRep.title}
					onChange={(e) => setCreditsNameRep({ ...creditsNameRep, title: e.target.value })}
				/>
			</Row>
			<Row>
				<Button variant="contained" fullWidth onClick={() => nodecg.sendMessage('hide-lowerthird')}>
					Hide Lowerthird
				</Button>
				<Button variant="contained" fullWidth onClick={() => nodecg.sendMessage('show-lowerthird')}>
					Show Lowerthird
				</Button>
			</Row>
		</ThemeProvider>
	);
};

createRoot(document.getElementById('root')!).render(<Settings />);
