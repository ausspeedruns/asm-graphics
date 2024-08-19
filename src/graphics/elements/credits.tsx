import React, { useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useListenFor } from "@nodecg/react-hooks";

// import EventLogo from "../elements/event-specific/asm-24/asm-24-logo.webp";

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
	color: #ffffff;
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
		tl.to(allCreditsRef.current, { marginTop: -10650, duration: 120, ease: "none" }, "+=1");
		tl.to(allCreditsRef.current, { width: 0, duration: 2 });
	});

	return (
		<CreditsContainer ref={creditsBGRef}>
			<AllCredits ref={allCreditsRef}>
				<EventImg>
					{/* <img style={{ width: "90%", height: "auto" }} src={EventLogo} /> */}
				</EventImg>
				<Title>
					Australian Speedrun
					<br />
					Marathon 2024
				</Title>
				<Title>AusSpeedruns Committee</Title>
				<NameContainer>
					<NameWithRoles>
						ASM Coordinator<Name>neo_</Name>
					</NameWithRoles>
					<NameWithRoles>
						AusSpeedruns Director<Name>Sten</Name>
					</NameWithRoles>
					<NameWithRoles>
						ASAP Coordinator<Name>Astrious</Name>
					</NameWithRoles>
					<NameWithRoles>
						Operations Manager<Name>werster</Name>
					</NameWithRoles>
					<NameWithRoles>
						Hardware Manager<Name>neɪ</Name>
					</NameWithRoles>
					<NameWithRoles>
						Software Manager<Name>Clubwho</Name>
					</NameWithRoles>
					<NameWithRoles>
						Runner Manager<Name>LaceyStripes</Name>
					</NameWithRoles>
					<NameWithRoles>
						Marketing Manager<Name>Kuiperbole</Name>
					</NameWithRoles>
					<NameWithRoles>
						Sponsorship Manager<Name>Kenorah</Name>
					</NameWithRoles>
					<NameWithRoles>
						Creative Manager<Name>Synrey</Name>
					</NameWithRoles>
					{/* <NameWithRoles>
						Event Consultant<Name>Upjohn</Name>
					</NameWithRoles> */}
				</NameContainer>
				<Title>Tech</Title>
				<NameContainer>
					<Name>Alecat</Name>
					<Name>Aytoms</Name>
					<Name>BalakehB</Name>
					<Name>Clubwho</Name>
					<Name>Dillon</Name>
					<Name>Kenorah</Name>
					<Name>neɪ</Name>
					<Name>neo_</Name>
					<Name>Ninten</Name>
					<Name>NitrosTwitch</Name>
					<Name>Noops</Name>
					<Name>Sten</Name>
					<Name>vichisuki</Name>
				</NameContainer>
				<Title>Runner Management</Title>
				<NameContainer>
					<Name>BalakehB</Name>
					<Name>Baphy</Name>
					<Name>Ins0mnia</Name>
					<Name>JTMagicman</Name>
					<Name>LaceyStripes</Name>
					<Name>Nicosar</Name>
					<Name>Noops</Name>
					<Name>srd_27</Name>
					<Name>Synrey</Name>
					<Name>TasmaniaJones</Name>
				</NameContainer>
				<Title>Social Media</Title>
				<NameContainer>
					<Name>Haru</Name>
					<Name>Kenorah</Name>
					<Name>Kuiperbole</Name>
					<Name>LaceyStripes</Name>
					<Name>neo_</Name>
					<Name>Sten</Name>
					<Name>Synrey</Name>
					<Name>vichisuki</Name>
				</NameContainer>
				<Title>Hosts</Title>
				<NameContainer>
					<Name>Chokocchi</Name>
					<Name>Galasrinie</Name>
					<Name>Ghoul02</Name>
					<Name>InputEvelution</Name>
					<Name>Ins0mnia</Name>
					<Name>JTMagicman</Name>
					<Name>Kenorah</Name>
					<Name>LittleCrowShae</Name>
					<Name>megaslayer321a</Name>
					<Name>Nicosar</Name>
					<Name>Noops</Name>
					<Name>srd_27</Name>
					<Name>syo</Name>
					<Name>Upjohn</Name>
					<Name>werster</Name>
				</NameContainer>
				<Title>Runners</Title>
				<NameContainer>
					<Name>AeonFrodo</Name>
					<Name>Alecat</Name>
					<Name>AtomicCaleb</Name>
					<Name>Aun_El</Name>
					<Name>BalakehB</Name>
					<Name>Baphy</Name>
					<Name>Bored_Banana</Name>
					<Name>cate</Name>
					<Name>Chokocchi</Name>
					<Name>Clubwho</Name>
					<Name>ConicalFlak</Name>
					<Name>Craigelbagel001</Name>
					<Name>Dactyly</Name>
					<Name>Drakodan</Name>
					<Name>FoksMachine</Name>
					<Name>Funk</Name>
					<Name>Galasrinie</Name>
					<Name>gamer_olive</Name>
					<Name>Ghoul02</Name>
					<Name>Glint</Name>
					<Name>GLPhoenix</Name>
					<Name>ICEMAN</Name>
					<Name>Inotovis</Name>
					<Name>InputEvelution</Name>
					<Name>ins0mnia</Name>
					<Name>ItsCorpsey</Name>
					<Name>JTMagicman</Name>
					<Name>Kenorah</Name>
					<Name>LaceyStripes</Name>
					<Name>lucilletea</Name>
					<Name>meatr0o</Name>
					<Name>megaslayer321a</Name>
					<Name>Miku_DS</Name>
					<Name>Muki</Name>
					<Name>neɪ</Name>
					<Name>neo_</Name>
					<Name>Nicosar</Name>
					<Name>Ninten</Name>
					<Name>Noops</Name>
					<Name>Olii</Name>
					<Name>Paulmall</Name>
					<Name>Perigon</Name>
					<Name>Pichy_Stockmann</Name>
					<Name>Rab</Name>
					<Name>Raikou</Name>
					<Name>Rexaaayyy</Name>
					<Name>Saiyanz</Name>
					<Name>Softman25</Name>
					<Name>srd_27</Name>
					<Name>Sten</Name>
					<Name>StingySeagull</Name>
					<Name>stylonide</Name>
					<Name>syo</Name>
					<Name>TasmaniaJones</Name>
					<Name>The8bitbeast</Name>
					<Name>VGmaster</Name>
					<Name>vichisuki</Name>
					<Name>werster</Name>
					<Name>Yuki~Layla</Name>
					<Name>ZoomieG</Name>
				</NameContainer>
				<Title>Special Thanks</Title>
				<NameContainer>
					<NameWithRoles>Cure Cancer Australia</NameWithRoles>
					<NameWithRoles>Adelaide Rockford</NameWithRoles>
					<NameWithRoles style={{ marginTop: 15 }}>
						Tech Equipment<Name>Adelaide Rockford</Name>
						<Name>neɪ</Name>
						<Name>Clubwho</Name>
						<Name>neo_</Name>
						<Name>Raikou</Name>
					</NameWithRoles>
					<NameWithRoles style={{ marginTop: 15 }}>
						AusSpeedruns LED logo<Name>Alecat</Name>
					</NameWithRoles>
					<NameWithRoles>
						Developers of<Name>OBS</Name>
						<Name>NodeCG</Name>
						<Name>nodecg-speedcontrol</Name>
					</NameWithRoles>
					<NameWithRoles style={{ marginTop: 15 }}>
						Timer Font: Seamless<Name>Michiel de Boer</Name>
					</NameWithRoles>
					<NameWithRoles>All commentators</NameWithRoles>
					<NameWithRoles>All donators</NameWithRoles>
					<NameWithRoles>{"and especially you <3"}</NameWithRoles>
				</NameContainer>
			</AllCredits>
		</CreditsContainer>
	);
};
