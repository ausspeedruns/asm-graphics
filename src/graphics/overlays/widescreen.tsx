import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { Facecam } from '../elements/facecam';
import { Timer } from '../elements/timer';
import { SponsorsBox } from '../elements/sponsors';
import * as RunInfo from '../elements/run-info';
import { OrangeStripe } from '../elements/orange-stripe';
import { Couch } from '../elements/couch';
import { ASMBanner } from '../elements/asm-banner';

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	top: 156px;
	height: 860px;
	width: 390px;
	border-right: 1px solid var(--asm-orange);
	/* border-top: 1px solid var(--asm-orange); */
`;

const SidebarBG = styled.div`
	background: var(--main-col);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 446px;
	padding-top: 14px;
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* position: absolute; */
	width: 100%;
	/* height: 459px; */
	flex-grow: 1;
	/* left: 0px;
	top: 400px; */
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const InfoBar = styled.div`
	background: var(--main-col);
	border-bottom: 1px var(--asm-orange) solid;
	position: absolute;
	height: 156px;
	width: 1920px;
	display: flex;
	justify-content: space-around;
	align-items: center;
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

const InfoDivider = styled.div`
	height: 77%;
	width: 1px;
	background: var(--asm-orange);
`;

const SponsorSize = {
	height: 300,
	width: 300,
};

const TwitterSize = {
	height: 252,
    width: 360,
    marginTop: -41
};

export const Widescreen: React.FC<OverlayProps> = (props) => {
	return (
		<WidescreenContainer>
			<InfoBar>
				<VerticalStack style={{ flexGrow: 1 }}>
					<RunInfo.GameTitle
						maxWidth={680}
						game={props.runData?.game || ''}
						style={{ marginBottom: -25, marginTop: -4 }}
					/>
					<RunInfo.System system={props.runData?.system || ''} />
				</VerticalStack>
				<InfoDivider />
				<VerticalStack style={{ flexGrow: 1 }}>
					<RunInfo.Category
						maxWidth={420}
						category={props.runData?.category || ''}
						style={{ marginBottom: -25 }}
					/>
					<RunInfo.Estimate
						estimate={props.runData?.estimate || ''}
					/>
				</VerticalStack>
				<InfoDivider />
				<Timer style={{ width: 612, zIndex: 2 }} timer={props.timer} />
			</InfoBar>
			<Sidebar>
				<Facecam maxNameWidth={270} height={400} teams={props.runData?.teams} noCam={props.preview ? props.noCam.preview : props.noCam.current} />
				<SidebarBG>
					<Couch
						couch={props.preview ? props.couchInformation.preview : props.couchInformation.current}
					/>
					<ASMBanner style={{marginTop: 4}} />
					<SponsorBoxS
						sponsorStyle={SponsorSize}
						tweetStyle={TwitterSize}
					/>

					<OrangeStripe side="bottom" style={{ width: '100%' }} />
				</SidebarBG>
			</Sidebar>
		</WidescreenContainer>
	);
};
