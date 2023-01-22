import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '@asm-graphics/types/OverlayProps';

import { ISmallStyling, SmallInfo } from '../elements/info-box/small';
import { Facecam } from '../elements/facecam';

const DSContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
	border-right: 1px solid var(--sec);
	overflow: hidden;
`;

const DSSecondScreen = styled.div`
	width: 564px;
	height: 423px;
	border-top: 1px solid var(--sec);
`;

const customSmallStyle: ISmallStyling = {
	mainStyle: {
		background: 'var(--main)',
		height: 239,
	},
	timerSize: 65,
};

export const DS: React.FC<OverlayProps> = (props) => {
	return (
		<DSContainer>
			<Sidebar>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
					audioIndicator={props.obsAudioIndicator}
				/>
				<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyle} />
				<DSSecondScreen />
			</Sidebar>
		</DSContainer>
	);
};
