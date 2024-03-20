import React, { useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useListenFor } from "use-nodecg";

import EventLogo from "../media/ASGX23/ASGX23Logo.png";

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
		tl.to(allCreditsRef.current, { marginTop: -8800, duration: 120, ease: "none" }, "+=1");
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
					The Game Expo 2024
				</Title>
				<Title>AusSpeedruns Committee</Title>
				<NameContainer>
					<NameWithRoles>
						ASGX Coordinator<Name>neɪ</Name>
					</NameWithRoles>
					<NameWithRoles>
						Director<Name>Sten</Name>
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
					<Name>Clockdistrict</Name>
					<Name>Dillon</Name>
					<Name>neɪ</Name>
					<Name>Ninten</Name>
					<Name>NitrosTwitch</Name>
					<Name>Sten</Name>
					<Name>Tsukahh</Name>
				</NameContainer>
				<Title>Runner Management</Title>
				<NameContainer>
					<Name>Baphy</Name>
					<Name>Geolubread</Name>
					<Name>Lacey</Name>
					<Name>Sten</Name>
					<Name>TasmaniaJones</Name>
				</NameContainer>
				{/* <Title>Social Media</Title>
				<NameContainer>
					<Name>HoshinoHaru</Name>
					<Name>Kenorah</Name>
					<Name>Kuiperbole</Name>
					<Name>limchi</Name>
					<Name>nase</Name>
					<Name>neo</Name>
				</NameContainer> */}
				<Title>Hosts</Title>
				<NameContainer>
					<Name>Galasrinie</Name>
					<Name>Kenorah</Name>
					<Name>Lacey</Name>
				</NameContainer>
				<Title>Runners</Title>
				<NameContainer>
					<Name>AeonFrodo</Name>
					<Name>Baphy</Name>
					<Name>Clockdistrict</Name>
					<Name>Dactyly</Name>
					<Name>ekimekim</Name>
					<Name>Galasrinie</Name>
					<Name>GameNerd607</Name>
					<Name>Geolubread</Name>
					<Name>Kenorah</Name>
					<Name>LiquidWifi</Name>
					<Name>Raikou</Name>
					<Name>ribbongraph</Name>
					<Name>SNC_Sector7G</Name>
					<Name>syo</Name>
				</NameContainer>
				<Title>Special Thanks</Title>
				<NameContainer>
					<NameWithRoles>Cure Cancer Australia</NameWithRoles>
					<NameWithRoles>The Game Expo</NameWithRoles>
					<NameWithRoles style={{ marginTop: 15 }}>
						AusSpeedruns LED logo<Name>Alecat</Name>
					</NameWithRoles>
					{/* <NameWithRoles style={{ marginTop: 15 }}>
						Audio Equipment<Name>domuel</Name>
					</NameWithRoles> */}
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
