import React, { useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useListenFor } from 'use-nodecg';

import ASM2022Logo from '../media/ASM2022 Logo.svg';

const CreditsContainer = styled.div`
	position: relative;
	left: 0;
	width: 0;
	height: 100%;
	color: var(--text-light);
	font-family: Noto Sans;
	background: #00000083;

	* {
		white-space: nowrap;
	}
`;

const AllCredits = styled.div`
	display: flex;
	flex-direction: column;
	bottom: -8800px;
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
	font-family: Noto Sans, sans-serif;
	font-weight: bold;
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
		tl.to(creditsBGRef.current, { width: 500, duration: 2 });
		tl.to(allCreditsRef.current, { bottom: 1100, duration: 100, ease: 'none' }, '+=1');
		tl.to(creditsBGRef.current, { width: 0, duration: 2 });
	});

	return (
		<CreditsContainer ref={creditsBGRef}>
			<AllCredits ref={allCreditsRef}>
				<EventImg>
					<img style={{ width: '90%', height: 'auto' }} src={ASM2022Logo} />
				</EventImg>
				<Title>Australian Speedrun<br/>Marathon 2022</Title>
				<Title>AusSpeedruns Committee</Title>
				<NameContainer>
					<NameWithRoles>
						Coordinator<Name>Softman25</Name>
					</NameWithRoles>
					<NameWithRoles>
						Coordinator<Name>Astrious</Name>
					</NameWithRoles>
					<NameWithRoles>
						Technical Coordinator (Hardware)<Name>nei_</Name>
					</NameWithRoles>
					<NameWithRoles>
						Technical Coordinator (Software)<Name>Clubwho</Name>
					</NameWithRoles>
					<NameWithRoles>
						Head of General Committee<Name>werster</Name>
					</NameWithRoles>
					<NameWithRoles>
						Head of Runner Management<Name>Sten</Name>
					</NameWithRoles>
					<NameWithRoles>
						Sponsorship Management<Name>neo</Name>
					</NameWithRoles>
					<NameWithRoles>
						Social Media Management<Name>nase</Name>
					</NameWithRoles>
					<NameWithRoles>
						Event Consultant<Name>Upjohn</Name>
					</NameWithRoles>
				</NameContainer>
				<Title>Tech</Title>
				<NameContainer>
					<Name>Aytoms</Name>
					<Name>Clockdistrict</Name>
					<Name>Clubwho</Name>
					<Name>jymmyboi</Name>
					<Name>nei_</Name>
				</NameContainer>
				<Title>Runner Management</Title>
				<NameContainer>
					<Name>ConicalFlak</Name>
					<Name>ins0mnia</Name>
					<Name>Kenorah</Name>
					<Name>Kuiperbole</Name>
					<Name>LaceyStripes</Name>
					<Name>lim</Name>
					<Name>megaslayer321a</Name>
					<Name>neo</Name>
					<Name>RykonGamingAU</Name>
					<Name>Sten</Name>
					<Name>Upjohn</Name>
				</NameContainer>
				<Title>Social Media</Title>
				<NameContainer>
					<Name>CruncieVT</Name>
					<Name>cleo</Name>
					<Name>Galasrinie</Name>
					<Name>Kuiperbole</Name>
					<Name>lim</Name>
					<Name>nase</Name>
				</NameContainer>
				<Title>Hosts</Title>
				<NameContainer>
					<Name>Clockdistrict</Name>
					<Name>d13sel</Name>
					<Name>Galasrinie</Name>
					<Name>ins0mnia</Name>
					<Name>Kenorah</Name>
					<Name>lim</Name>
					<Name>megaslayer321a</Name>
					<Name>MikamiHero</Name>
					<Name>nase</Name>
					<Name>RykonGamingAU</Name>
					<Name>Softman25</Name>
					<Name>werster</Name>
				</NameContainer>
				<Title>Runners</Title>
				<NameContainer>
					<Name>AeonFrodo</Name>
					<Name>Alecat</Name>
					<Name>AtomicCaleb</Name>
					<Name>Aun_El</Name>
					<Name>BlazenBezza</Name>
					<Name>Bored_Banana</Name>
					<Name>Callmeliam</Name>
					<Name>chokocchi</Name>
					<Name>Clockdistrict</Name>
					<Name>ConicalFlak</Name>
					<Name>Craigelbagel001</Name>
					<Name>crofty</Name>
					<Name>d13sel</Name>
					<Name>Dactyly</Name>
					<Name>DaMidget2000</Name>
					<Name>Danicker</Name>
					<Name>devo</Name>
					<Name>Duk700</Name>
					<Name>DutchPotato</Name>
					<Name>Firery</Name>
					<Name>Galasrinie</Name>
					<Name>Glint</Name>
					<Name>Gordo98</Name>
					<Name>Hans_Stockmann</Name>
					<Name>hsblue</Name>
					<Name>ICEMAN</Name>
					<Name>ins0mnia</Name>
					<Name>JTMagicman</Name>
					<Name>Juh0</Name>
					<Name>jymmyboi</Name>
					<Name>Kenorah</Name>
					<Name>LaceyStripes</Name>
					<Name>LiquidWiFi</Name>
					<Name>LucilleTea</Name>
					<Name>MangoPunch</Name>
					<Name>meatr0o</Name>
					<Name>Mecheon</Name>
					<Name>megaslayer321a</Name>
					<Name>MikamiHero</Name>
					<Name>Miku_ds</Name>
					<Name>nase</Name>
					<Name>neo_</Name>
					<Name>Nicosar</Name>
					<Name>Ninten</Name>
					<Name>Paladinight</Name>
					<Name>Paracusia</Name>
					<Name>parsoFish</Name>
					<Name>Pathetik</Name>
					<Name>Piqal</Name>
					<Name>Prophetblack</Name>
					<Name>Raikou</Name>
					<Name>RykonGamingAU</Name>
					<Name>Saiyanz</Name>
					<Name>smoker</Name>
					<Name>Softman25</Name>
					<Name>Sten</Name>
					<Name>stylonide</Name>
					<Name>syo</Name>
					<Name>The8bitbeast</Name>
					<Name>Thom</Name>
					<Name>Ticker</Name>
					<Name>tim_trollgasm</Name>
					<Name>VGmaster</Name>
					<Name>Washeyy</Name>
					<Name>WaterproofTeabag_</Name>
					<Name>werster</Name>
					<Name>Wilbo</Name>
					<Name>WOT7N</Name>
					<Name>Yuki~Layla</Name>
				</NameContainer>
				<Title>Special Thanks</Title>
				<NameContainer>
					<NameWithRoles>Cure Cancer Australia</NameWithRoles>
					<NameWithRoles>Game On Cancer</NameWithRoles>
					<NameWithRoles>HyperX</NameWithRoles>
					<NameWithRoles>Landfall Games</NameWithRoles>
					<NameWithRoles>in. Studio</NameWithRoles>
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
