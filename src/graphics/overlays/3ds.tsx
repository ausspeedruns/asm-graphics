import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { WideInfo, IWideStyling } from '../elements/info-box/wide';
import { Facecam } from '../elements/facecam';

const ThreeDSContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	top: 175px;
	height: 841px;
	width: 517px;
	border-right: 1px solid var(--sec);
	z-index: -1;
`;

const customWideStyle: IWideStyling = {
	mainStyle: {
		height: 174,
	},
};

export const ThreeDS: React.FC<OverlayProps> = (props) => {
	return (
		<ThreeDSContainer>
			<WideInfo timer={props.timer} runData={props.runData} style={customWideStyle} />
			<Sidebar>
				<Facecam
					// style={{ borderBottom: '1px solid #FFC629' }}
					maxNameWidth={270}
					height={452}
					teams={props.runData?.teams}
					pronounStartSide="right"
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
					audioIndicator={props.obsAudioIndicator}
				/>
			</Sidebar>
		</ThreeDSContainer>
	);
};
