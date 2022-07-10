import React from 'react';
import { createRoot } from 'react-dom/client';
// import styled from 'styled-components';

import { Button, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme';

export const DashAds: React.FC = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			<Button onClick={() => nodecg.sendMessage('playAd', 'HyperX')}>HyperX (30 Seconds)</Button>
			<Button onClick={() => nodecg.sendMessage('playAd', 'GOC')}>Game On Cancer (43 Seconds)</Button>
		</ThemeProvider>
	);
};

createRoot(document.getElementById('root')!).render(<DashAds />);
