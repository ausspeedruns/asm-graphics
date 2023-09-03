import React, { useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useListenFor } from "use-nodecg";

import EventLogo from "../media/ASM23/logo.png";

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
	background: #000000c4;
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
	font-family:
		Russo One,
		sans-serif;
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

	useListenFor("start-credits", () => {
		const tl = gsap.timeline();
		// Start credits
		tl.to(allCreditsRef.current, { width: 500, duration: 2 });
		tl.to(allCreditsRef.current, { marginTop: -9750, duration: 120, ease: "none" }, "+=1");
		tl.to(allCreditsRef.current, { width: 0, duration: 2 });
	});

	return (
		<CreditsContainer ref={creditsBGRef}>
			<AllCredits ref={allCreditsRef}>
				<EventImg>
					<img style={{ width: "90%", height: "auto" }} src={EventLogo} />
				</EventImg>
				<Title>
					Australian Speedrun
					<br />
					Marathon 2023
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
						Software Coordinator<Name>Clubwho</Name>
					</NameWithRoles>
					<NameWithRoles>
						Hardware Coordinator<Name>nei_</Name>
					</NameWithRoles>
					<NameWithRoles>
						Head of Runner Management<Name>Sten</Name>
					</NameWithRoles>
					<NameWithRoles>
						Head of Marketing<Name>nase</Name>
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
					<Name>Alecat</Name>
					<Name>Clockdistrict</Name>
					<Name>Clubwho</Name>
					<Name>CurtMantis</Name>
					<Name>LaceyStripes</Name>
					<Name>nei_</Name>
					<Name>NitrosTwitch</Name>
				</NameContainer>
				<Title>Runner Management</Title>
				<NameContainer>
					<Name>Astrious</Name>
					<Name>HeyItsRykon</Name>
					<Name>ins0mnia</Name>
					<Name>LaceyStripes</Name>
					<Name>neo_</Name>
					<Name>Nicosar</Name>
					<Name>Noops</Name>
					<Name>Sten</Name>
					<Name>Softman25</Name>
					<Name>Upjohn</Name>
				</NameContainer>
				<Title>Social Media</Title>
				<NameContainer>
					<Name>Grandma</Name>
					<Name>HoshinoHaru</Name>
					<Name>Kenorah</Name>
					<Name>Kuiperbole</Name>
					<Name>limchi</Name>
					<Name>nase</Name>
				</NameContainer>
				<Title>Hosts</Title>
				<NameContainer>
					<Name>AggytheAron</Name>
					<Name>ConicalFlak</Name>
					<Name>Galasrinie</Name>
					<Name>Genba</Name>
					<Name>HeyItsRykon</Name>
					<Name>ins0mnia</Name>
					<Name>Kenorah</Name>
					<Name>LaceyStripes</Name>
					<Name>MikamiHero</Name>
					<Name>neo_</Name>
					<Name>Noops</Name>
					<Name>Sten</Name>
					<Name>werster</Name>
				</NameContainer>
				<Title>Runners</Title>
				<NameContainer>
					<Name>AeonFrodo</Name>
					<Name>AggytheAron</Name>
					<Name>Alecat</Name>
					<Name>Arma260</Name>
					<Name>BalakehB </Name>
					<Name>Baphy</Name>
					<Name>cane</Name>
					<Name>chokocchi</Name>
					<Name>Clockdistrict</Name>
					<Name>ConicalFlak</Name>
					<Name>CurtMantis</Name>
					<Name>cyanidesugar</Name>
					<Name>d13sel</Name>
					<Name>DaMidget2000</Name>
					<Name>Damosk </Name>
					<Name>Danicker</Name>
					<Name>Dezinator94</Name>
					<Name>Duk700</Name>
					<Name>Firery</Name>
					<Name>FroSteeMate</Name>
					<Name>Galasrinie</Name>
					<Name>Glint</Name>
					<Name>GLPhoenix</Name>
					<Name>Hans_Stockmann</Name>
					<Name>Heckson</Name>
					<Name>HeyItsRykon</Name>
					<Name>hsblue</Name>
					<Name>ICEMAN</Name>
					<Name>ins0mnia</Name>
					<Name>Joester98 </Name>
					<Name>jymmyboi</Name>
					<Name>Kenorah</Name>
					<Name>KthRam</Name>
					<Name>limchi</Name>
					<Name>LiquidWiFi</Name>
					<Name>LittleCrowShae</Name>
					<Name>lucilletea</Name>
					<Name>MangoPunch</Name>
					<Name>meatr0o</Name>
					<Name>MikamiHero</Name>
					<Name>Miku_DS</Name>
					<Name>nase</Name>
					<Name>nei</Name>
					<Name>neo_</Name>
					<Name>Nicosar</Name>
					<Name>Ninten</Name>
					<Name>Noops</Name>
					<Name>Perigon</Name>
					<Name>rad_shaz</Name>
					<Name>Rexaaayyy</Name>
					<Name>Saiyanz </Name>
					<Name>Softman25</Name>
					<Name>srd_27</Name>
					<Name>Sten</Name>
					<Name>stylonide</Name>
					<Name>syo</Name>
					<Name>tim_trollgasm </Name>
					<Name>VGmaster</Name>
					<Name>werster</Name>
					<Name>WOT7N</Name>
					<Name>Yuki~Layla</Name>
				</NameContainer>
				<Title>Special Thanks</Title>
				<NameContainer>
					<NameWithRoles>Cure Cancer Australia</NameWithRoles>
					<NameWithRoles>Game On Cancer</NameWithRoles>
					<NameWithRoles>Elgato</NameWithRoles>
					<NameWithRoles>Rockford Adelaide</NameWithRoles>
					<NameWithRoles style={{ marginTop: 15 }}>
						AusSpeedruns LED logo<Name>Alecat</Name>
					</NameWithRoles>
					<NameWithRoles style={{ marginTop: 15 }}>
						Audio Equipment<Name>domuel</Name>
					</NameWithRoles>
					<NameWithRoles style={{ marginTop: 15 }}>
						Camera Equipment<Name>Clockdistrict</Name>
					</NameWithRoles>
					<NameWithRoles>
						Developers of<Name>OBS</Name>
						<Name>NodeCG</Name>
						<Name>nodecg-speedcontrol</Name>
						<Name>obs-websocket</Name>
					</NameWithRoles>
					<NameWithRoles>All commentators</NameWithRoles>
					<NameWithRoles>All donators</NameWithRoles>
					<NameWithRoles>{"and especially you <3"}</NameWithRoles>
				</NameContainer>
			</AllCredits>
		</CreditsContainer>
	);
};
