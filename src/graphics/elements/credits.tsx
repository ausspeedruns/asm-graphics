import React, { useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useListenFor } from 'use-nodecg';

import EventLogo from '../media/ASGX23/ASGX23Logo.png';

const CreditsContainer = styled.div`
	position: relative;
	/* left: 0; */
	/* display: flex;
	justify-content: center; */
	width: 100%;
	height: 100%;

	* {
		white-space: nowrap;
	}
`;

const AllCredits = styled.div`
	display: flex;
	flex-direction: column;
	/* bottom: -8800px; */
	/* position: absolute;
	top: 0; */
	width: 0px;
	align-items: center;
	justify-content: center;
	font-family: Noto Sans;
	background: #00000083;
	color: var(--text-light);
	margin: auto;
	padding-top: 1016px;
	padding-bottom: 1200px;
`;

const EventImg = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const Title = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	font-size: 30px;
	margin-top: 30px;
	font-family: Russo One, sans-serif;
	text-align: center;
`;

const NameContainer = styled.div`
	font-size: 26px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const Name = styled.span`
	margin: 15px 0;
	font-family: Noto Sans;
`;

const NameWithRoles = styled.div`
	font-weight: bold;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 10px;
	text-align: center;

	& > span {
		margin-top: -5px;
		font-weight: normal !important;
	}
`;

export const Credits: React.FC = () => {
	const creditsBGRef = useRef<HTMLDivElement>(null);
	const allCreditsRef = useRef<HTMLDivElement>(null);

	useListenFor('start-credits', () => {
		const tl = gsap.timeline();
		// Start credits
		tl.to(allCreditsRef.current, { width: 500, duration: 2 });
		tl.to(allCreditsRef.current, { marginTop: -5473, duration: 50, ease: 'none' }, '+=1');
		tl.to(allCreditsRef.current, { width: 0, duration: 2 });
	});

	return (
		<CreditsContainer ref={creditsBGRef}>
			<AllCredits ref={allCreditsRef}>
				<EventImg><img style={{ width: '90%', height: 'auto' }} src={EventLogo} /></EventImg>
				<Title>
					AusSpeedruns @
					<br />
					The Game Expo 2023
				</Title>
				<Title>AusSpeedruns Committee</Title>
				<NameContainer>
					<NameWithRoles>
						Coordinator<Name>Softman25</Name>
					</NameWithRoles>
					<NameWithRoles>
						Coordinator<Name>Astrious</Name>
					</NameWithRoles>
					<NameWithRoles>
						ASGX Coordinator<br />Hardware Coordinator<Name>nei_</Name>
					</NameWithRoles>
					<NameWithRoles>
						Software Coordinator<Name>Clubwho</Name>
					</NameWithRoles>
					<NameWithRoles>
						Head of Runner Management<Name>Sten</Name>
					</NameWithRoles>
					<NameWithRoles>
						Social Media Management<Name>nase</Name>
					</NameWithRoles>
					<NameWithRoles>
						Head of General Committee<Name>werster</Name>
					</NameWithRoles>
					<NameWithRoles>
						Sponsorship Management<Name>neo</Name>
					</NameWithRoles>
					<NameWithRoles>
						Event Consultant<Name>Upjohn</Name>
					</NameWithRoles>
				</NameContainer>
				<Title>Tech</Title>
				<NameContainer>
					<Name>Clockdistrict</Name>
					<Name>Clubwho</Name>
					<Name>CurtMantis</Name>
					<Name>Shyguy</Name>
					<Name>nei_</Name>
				</NameContainer>
				<Title>Runner Management</Title>
				<NameContainer>
					<Name>Kenorah</Name>
					<Name>LaceyStripes</Name>
					<Name>Noops</Name>
					<Name>Sten</Name>
				</NameContainer>
				<Title>Social Media</Title>
				<NameContainer>
					<Name>HoshinoHaru</Name>
					<Name>Kuiperbole</Name>
					<Name>nase</Name>
				</NameContainer>
				<Title>Hosts</Title>
				<NameContainer>
					<Name>Arahpthos</Name>
					<Name>jksessions</Name>
					<Name>Kenorah</Name>
					<Name>Noops</Name>
				</NameContainer>
				<Title>Runners</Title>
				<NameContainer>
					<Name>AeonFrodo</Name>
					<Name>Arahpthos</Name>
					<Name>AtomicCaleb</Name>
					<Name>Austamate</Name>
					<Name>Baphy</Name>
					<Name>Bksilv3r</Name>
					<Name>Bored_Banana</Name>
					<Name>Clockdistrict</Name>
					<Name>CurtMantis</Name>
					<Name>Ninten</Name>
					<Name>Perigon</Name>
					<Name>Raikou</Name>
					<Name>Slivenius</Name>
					<Name>srd_27</Name>
					<Name>TasmaniaJones</Name>
					<Name>Thom</Name>
					<Name>Ticker</Name>
					<Name>VGmaster</Name>
					<Name>Yuki~Layla</Name>
				</NameContainer>
				<Title>Special Thanks</Title>
				<NameContainer>
					<NameWithRoles>The Game Expo</NameWithRoles>
					<NameWithRoles>Cure Cancer Australia</NameWithRoles>
					<NameWithRoles>Game On Cancer</NameWithRoles>
					<NameWithRoles style={{ marginTop: 15 }}>
						AusSpeedruns LED logo<Name>Alecat</Name>
					</NameWithRoles>
					<NameWithRoles>
						Developers of<Name>OBS</Name>
						<Name>NodeCG</Name>
						<Name>nodecg-speedcontrol</Name>
						<Name>obs-websocket</Name>
					</NameWithRoles>
					<Name>All commentators</Name>
					<Name>All donators</Name>
					<Name>{'and especially you <3'}</Name>
				</NameContainer>
			</AllCredits>
		</CreditsContainer>
	);
};
