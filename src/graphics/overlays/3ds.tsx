import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { WideInfo, IWideStyling } from '../elements/info-box/wide';
import { Facecam } from '../elements/facecam';
import { Couch } from '../elements/couch';
import { ASMBanner } from '../elements/asm-banner';
import { OrangeStripe } from '../elements/orange-stripe';

const ThreeDSContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	top: 175px;
	height: 841px;
	width: 517px;
	border-right: 1px solid var(--asm-orange);
	/* border-top: 1px solid var(--asm-orange); */
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
				<div
					style={{
						background: 'var(--main-col)',
						height: 411,
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<OrangeStripe side="top" />
					<img src="../shared/design/ASM21-BannerLogo White.svg" style={{ width: '55%' }} />
					<div style={{ width: '100%' }}>
						<Couch
							couch={props.preview ? props.couchInformation.preview : props.couchInformation.current}
						/>
						<ASMBanner style={{ marginTop: 4 }} />
					</div>
					<OrangeStripe side="bottom" />
				</div>
				<Facecam
					style={{ borderBottom: '1px solid var(--asm-orange)' }}
					maxNameWidth={270}
					height={41}
					teams={props.runData?.teams}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>
			</Sidebar>
		</ThreeDSContainer>
	);
};
