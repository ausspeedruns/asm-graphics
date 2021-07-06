import React, { useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useListenFor } from 'use-nodecg';

gsap.registerPlugin(TextPlugin);

const CreditsContainer = styled.div`
	position: absolute;
	margin: auto;
	bottom: 60px;
	width: 1920px;
	height: 340px;
	color: #ffffff;
	font-family: Noto Sans;
`;

const EventImg = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	opacity: 0;
`;

const Title = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	font-size: 30px;
	margin-bottom: 30px;
	opacity: 0;
`;

const NameContainer = styled.div`
	position: absolute;
	font-size: 25px;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	width: 100%;
	height: 100%;
	padding: 0 400px;
	box-sizing: border-box;
	opacity: 0;
`;
const Name = styled.span`
	font-weight: bold;
	margin: 0 15px;
`;

const NameWithRoles = styled.div`
	font-weight: bold;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 20px;

	& > span {
		font-weight: normal !important;
	}
`;

const HoldNames = 0.5; // How long to hold the names

export const Credits: React.FC = () => {
	const eventRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const committeeRef = useRef<HTMLDivElement>(null);
	// const runnerMgmtRef = useRef<HTMLDivElement>(null);
	// const hostsRef = useRef<HTMLDivElement>(null);
	const runnersRef1 = useRef<HTMLDivElement>(null);
	const runnersRef2 = useRef<HTMLDivElement>(null);
	const runnersRef3 = useRef<HTMLDivElement>(null);

	useListenFor('start-credits', () => {
		const tl = gsap.timeline();
		// Show event
		tl.to(eventRef.current, { opacity: 1, duration: 2 });
		tl.to(eventRef.current, { opacity: 0, duration: 2 }, '+=1');

		// Show committee
		tl.set(titleRef.current, { text: 'AusSpeedruns Committee' });
		tl.to(titleRef.current, { opacity: 1, duration: 2 });
		tl.to(committeeRef.current, { opacity: 1, duration: 2 });
		tl.to([titleRef.current, committeeRef.current], { opacity: 0, duration: 2 }, `+=${HoldNames}`);

		// Show runner management

		// Show hosts

		// Show runners
		tl.set(titleRef.current, { text: 'Runners' });
		tl.to(titleRef.current, { opacity: 1, duration: 2 }, '+=1');
		tl.to(runnersRef1.current, { opacity: 1, duration: 2 });
		tl.to(runnersRef1.current, { opacity: 0, duration: 2 }, `+=${HoldNames}`);
		tl.to(runnersRef2.current, { opacity: 1, duration: 2 });
		tl.to(runnersRef2.current, { opacity: 0, duration: 2 }, `+=${HoldNames}`);
		tl.to(runnersRef3.current, { opacity: 1, duration: 2 });
		tl.to([titleRef.current, runnersRef3.current], { opacity: 0, duration: 2 }, `+=${HoldNames}`);
	});

	return (
		<CreditsContainer>
			<EventImg ref={eventRef}>
				<img
					style={{ height: '75%', width: 'auto' }}
					src="../shared/design/AusSpeedruns-ASM2021-Combined_NoPadding.svg"
				/>
			</EventImg>
			<Title ref={titleRef}>AusSpeedruns Committee</Title>
			<NameContainer style={{ justifyContent: 'center' }} ref={committeeRef}>
				<NameWithRoles>
					Coordinator<Name>Softman25</Name>
				</NameWithRoles>
				<NameWithRoles>
					Coordinator<Name>Astrious</Name>
				</NameWithRoles>
				<NameWithRoles>
					Head of General Committee<Name>werster</Name>
				</NameWithRoles>
				<NameWithRoles>
					Head of Marketing<Name>LazyAssPirate</Name>
				</NameWithRoles>
				<NameWithRoles>
					Head of Sponsorships<Name>LiquidWifi</Name>
				</NameWithRoles>
				<NameWithRoles>
					Head of Runner Management<Name>Sten</Name>
				</NameWithRoles>
				<NameWithRoles>
					Head of Tech<Name>nei</Name>
				</NameWithRoles>
				<NameWithRoles>
					Broadcast Designer<Name>Clubwho</Name>
				</NameWithRoles>
				<NameWithRoles>
					Committee Representative<Name>Upjohn</Name>
				</NameWithRoles>
			</NameContainer>
			{/* <NameContainer ref={runnerMgmtRef}></NameContainer>
			<NameContainer ref={hostsRef}></NameContainer> */}
			<NameContainer ref={runnersRef1}>
				<Name>Acelord</Name>
				<Name>AeonFrodo</Name>
				<Name>Alecat</Name>
				<Name>Arahpthos</Name>
				<Name>Aspect</Name>
				<Name>AtomicCaleb</Name>
				<Name>Aun_El</Name>
				<Name>Barhunga</Name>
				<Name>Benedictatorr</Name>
				<Name>Benjlin</Name>
				<Name>Bored_Banana</Name>
				<Name>Callmeliam</Name>
				<Name>Catticko</Name>
				<Name>Clockdistrict</Name>
				<Name>Dactyly</Name>
				<Name>DaMidget2000</Name>
				<Name>danmcd</Name>
				<Name>Duk700</Name>
				<Name>Firery</Name>
				<Name>FireStriker</Name>
			</NameContainer>
			<NameContainer ref={runnersRef2}>
				<Name>Glint</Name>
				<Name>Gordo</Name>
				<Name>Hans 'Pichy' Stockmann</Name>
				<Name>Heckson</Name>
				<Name>hsblue</Name>
				<Name>InputEvelution</Name>
				<Name>ins0mnia</Name>
				<Name>JTMagicman</Name>
				<Name>jymmyboi</Name>
				<Name>Kenorah</Name>
				<Name>Lachurs</Name>
				<Name>LiquidWiFi</Name>
				<Name>Mage</Name>
				<Name>MangoPunch</Name>
				<Name>Martyrr</Name>
				<Name>meatr0o</Name>
				<Name>Mecheon</Name>
				<Name>megaslayer321a</Name>
				<Name>MikamiHero</Name>
				<Name>Miku</Name>
			</NameContainer>
			<NameContainer ref={runnersRef3}>
				<Name>mobius</Name>
				<Name>mPap</Name>
				<Name>nase</Name>
				<Name>Nicosar</Name>
				<Name>Noops</Name>
				<Name>Paulmall</Name>
				<Name>Psycho</Name>
				<Name>Rab</Name>
				<Name>Raikou</Name>
				<Name>Rexaaayyy</Name>
				<Name>RykonGamingAU</Name>
				<Name>some_random_npc</Name>
				<Name>SRLGrace</Name>
				<Name>stylonide</Name>
				<Name>The8bitbeast</Name>
				<Name>TheSirBorris</Name>
				<Name>Thom</Name>
				<Name>tim_trollgasm</Name>
				<Name>werster</Name>
				<Name>Yoshi100_Aus</Name>
			</NameContainer>
		</CreditsContainer>
	);
};
