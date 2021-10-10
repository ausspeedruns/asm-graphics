import React, { useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useListenFor } from 'use-nodecg';

const CreditsContainer = styled.div`
	position: relative;
	left: 0;
	width: 0;
	height: 100%;
	color: var(--text-col);
	font-family: National Park;
	background: #00000083;

	* {
		white-space: nowrap;
	}
`;

const AllCredits = styled.div`
	display: flex;
	flex-direction: column;
	bottom: -4850px;
	position: absolute;
	width: 100%;
	align-items: center;
	justify-content: center;
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
	font-family: kulturista-web, sans-serif;
	font-weight: bold;
`;

const NameContainer = styled.div`
	font-size: 26px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const Name = styled.span`
	margin: 15px 0;
`;

const NameWithRoles = styled.div`
	font-weight: bold;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 10px;

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
		tl.to(creditsBGRef.current, { width: 400, duration: 2 });
		tl.to(allCreditsRef.current, { bottom: 1100, duration: 100, ease: "none" }, '+=1');
		tl.to(creditsBGRef.current, { width: 0, opacity: 0, duration: 2 });
	});

	return (
		<CreditsContainer ref={creditsBGRef}>
			<AllCredits ref={allCreditsRef}>
				<EventImg>
					<img
						style={{ width: '90%', height: 'auto' }}
						src={require('../media/CreditsLogo.svg')}
					/>
				</EventImg>
				<Title>AusSpeedruns Committee</Title>
				<NameContainer>
					<NameWithRoles>
						Coordinator<Name>Astrious</Name>
					</NameWithRoles>
					<NameWithRoles>
						Coordinator<Name>Softman25</Name>
					</NameWithRoles>
					<NameWithRoles>
						Head of General Committee<Name>werster</Name>
					</NameWithRoles>
					<NameWithRoles>
						Head of Runner Management<Name>Sten</Name>
					</NameWithRoles>
					<NameWithRoles>
						Broadcast Designer<Name>Clubwho</Name>
					</NameWithRoles>
					<NameWithRoles>
						Technical Coordinator<Name>nei_</Name>
					</NameWithRoles>
					<NameWithRoles>
						Event Consultant<Name>Upjohn</Name>
					</NameWithRoles>
				</NameContainer>
				<Title>Runner Management</Title>
				<NameContainer>
					<Name>Bored_Banana</Name>
					<Name>Clockdistrict</Name>
					<Name>Kuiperbole</Name>
					<Name>LaceyStripes</Name>
					<Name>neo</Name>
					<Name>Noops</Name>
					<Name>Sten</Name>
					<Name>Upjohn</Name>
				</NameContainer>
				<Title>Hosts</Title>
				<NameContainer>
					<Name>Alecat</Name>
					<Name>Benjlin</Name>
					<Name>Bigg Fudge</Name>
					<Name>Clockdistrict</Name>
					<Name>jksessions</Name>
					<Name>JTMagicman</Name>
					<Name>megaslayer321a</Name>
				</NameContainer>
				<Title>Marketing</Title>
				<NameContainer>
					<Name>Grandma</Name>
				</NameContainer>
				<Title>Runners</Title>
				<NameContainer>
					<Name>AeonFrodo</Name>
					<Name>Aggy</Name>
					<Name>Alecat</Name>
					<Name>Alexandra Lynne</Name>
					<Name>andrew_f</Name>
					<Name>Arahpthos</Name>
					<Name>Aspect</Name>
					<Name>Barhunga</Name>
					<Name>Benedictatorr</Name>
					<Name>Bigg Fudge</Name>
					<Name>Blazen</Name>
					<Name>Cheftoad</Name>
					<Name>Clubwho</Name>
					<Name>Danicker</Name>
					<Name>Hans 'Pichy' Stockmann</Name>
					<Name>Heckson</Name>
					<Name>hsblue</Name>
					<Name>JTMagicman</Name>
					<Name>Kardi</Name>
					<Name>LaceyStripes</Name>
					<Name>Lycel</Name>
					<Name>meatr0o</Name>
					<Name>megaslayer321a</Name>
					<Name>MikamiHero</Name>
					<Name>nase</Name>
					<Name>nei_</Name>
					<Name>Neo</Name>
					<Name>Nicosar</Name>
					<Name>Paulmall</Name>
					<Name>ProphetBlack</Name>
					<Name>SlyZorua</Name>
					<Name>Sten</Name>
					<Name>stylonide</Name>
					<Name>Tasmania Jones</Name>
					<Name>tenguliam</Name>
					<Name>tim_trollgasm</Name>
					<Name>TripppAU</Name>
					<Name>werster</Name>
					<Name>Whisperra</Name>
					<Name>willbobsled</Name>
				</NameContainer>
				<Title>Special Thanks</Title>
				<NameContainer>
					<NameWithRoles>PAX Australia</NameWithRoles>
					<NameWithRoles>Cure Cancer</NameWithRoles>
					<NameWithRoles style={{marginTop: 15}}>
						Website<Name>dragnflier</Name>
					</NameWithRoles>
					<NameWithRoles>
						Developers of<Name>OBS</Name>
						<Name>NodeCG</Name>
						<Name>nodecg-speedcontrol</Name>
						<Name>obs-websocket</Name>
					</NameWithRoles>
					<Name>{'and especially you <3'}</Name>
				</NameContainer>
			</AllCredits>
		</CreditsContainer>
	);
};
