import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { ISmallStyling, SmallInfo } from '../elements/info-box/small';
import { Facecam } from '../elements/facecam';

const DSContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 564px;
	border-right: 1px solid var(--pax-gold);
	overflow: hidden;
`;

const DSSecondScreen = styled.div`
	width: 564px;
	height: 423px;
	border-bottom: 1px solid var(--pax-gold);
`;

const customSmallStyle: ISmallStyling = {
	mainStyle: {
		backgroundImage: "url(../shared/design/contour-maps/ds.svg)",
	}
}

export const DS: React.FC<OverlayProps> = (props) => {
	return (
		<DSContainer>
			<Sidebar>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>
				<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyle} />
				<DSSecondScreen />
			</Sidebar>
		</DSContainer>
	);
};
