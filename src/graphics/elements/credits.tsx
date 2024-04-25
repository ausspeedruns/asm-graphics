import React, { useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useListenFor } from "@nodecg/react-hooks";

import EventLogo from "../elements/event-specific/dh-24/asdh2024-logo.png";

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
		tl.to(allCreditsRef.current, { marginTop: -7000, duration: 120, ease: "none" }, "+=1");
		tl.to(allCreditsRef.current, { width: 0, duration: 2 });
	});

	return (
		<CreditsContainer ref={creditsBGRef}>
			<AllCredits ref={allCreditsRef}>
				<EventImg>
					<img style={{ width: "90%", height: "auto" }} src={EventLogo} />
				</EventImg>
				<Title>
					AusSpeedruns @
					<br />
					DreamHack 2024
				</Title>
				<Title>AusSpeedruns Committee</Title>
				<NameContainer>
					<NameWithRoles>
						ASDH Coordinator<br />AusSpeedruns Director<Name>Sten</Name>
					</NameWithRoles>
					<NameWithRoles>
						ASM Coordinator<Name>neo</Name>
					</NameWithRoles>
					<NameWithRoles>
						ASAP Coordinator<Name>Astrious</Name>
					</NameWithRoles>
					<NameWithRoles>
						Operations Manager<Name>werster</Name>
					</NameWithRoles>
					<NameWithRoles>
						Hardware Manager<Name>nei_</Name>
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
					<NameWithRoles>
						Event Consultant<Name>Upjohn</Name>
					</NameWithRoles>
				</NameContainer>
				<Title>Tech</Title>
				<NameContainer>
					<Name>Alecat</Name>
					<Name>Clockdistrict</Name>
					<Name>Clubwho</Name>
					<Name>Dillon</Name>
					<Name>Kenorah</Name>
					<Name>neɪ</Name>
					<Name>Ninten</Name>
					<Name>Sten</Name>
					<Name>Tsukahh</Name>
				</NameContainer>
				<Title>Runner Management</Title>
				<NameContainer>
					<Name>JTMagicman</Name>
					<Name>Kenorah</Name>
					<Name>Nicosar</Name>
					<Name>srd_27</Name>
					<Name>Synrey</Name>
					<Name>TasmaniaJones</Name>
				</NameContainer>
				<Title>Social Media</Title>
				<NameContainer>
					<Name>Kuiperbole</Name>
					<Name>Lacey</Name>
					<Name>limchi</Name>
					<Name>Synrey</Name>
					<Name>thom</Name>
				</NameContainer>
				<Title>Hosts</Title>
				<NameContainer>
					<Name>anhedonic</Name>
					<Name>Galasrinie</Name>
					<Name>jksessions</Name>
					<Name>JTMagicman</Name>
					<Name>Kenorah</Name>
					<Name>Lacey</Name>
					<Name>srd_27</Name>
					<Name>Sten</Name>
					<Name>thegemcosplay</Name>
				</NameContainer>
				<Title>Runners</Title>
				<NameContainer>
					<Name>360Chrism</Name>
					<Name>AeonFrodo</Name>
					<Name>Alecat</Name>
					<Name>AtomicCaleb</Name>
					<Name>Aun_El</Name>
					<Name>BalakehB</Name>
					<Name>Clockdistrict</Name>
					<Name>Dactyly</Name>
					<Name>Dezinator94</Name>
					<Name>FoksMachine</Name>
					<Name>Imanex</Name>
					<Name>JTMagicman</Name>
					<Name>limchi</Name>
					<Name>nase</Name>
					<Name>Nicosar</Name>
					<Name>Noops</Name>
					<Name>Sten</Name>
					<Name>syo</Name>
					<Name>TasmaniaJones</Name>
					<Name>Ticker</Name>
					<Name>ToastedMildly</Name>
					<Name>werster</Name>
					<Name>Wilbo</Name>
				</NameContainer>
				<Title>Special Thanks</Title>
				<NameContainer>
					<NameWithRoles>Cure Cancer Australia</NameWithRoles>
					<NameWithRoles>DreamHack</NameWithRoles>
					<NameWithRoles>ESL</NameWithRoles>
					<NameWithRoles style={{ marginTop: 15 }}>
						AusSpeedruns LED logo<Name>Alecat</Name>
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
