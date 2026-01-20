import { useRef } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useListenFor } from "@nodecg/react-hooks";

import EventLogo from "../overlays/backgrounds/logo.png";

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

const collator = new Intl.Collator();

const TECH = [
	"nei",
	"AtomicCaleb",
	"vichisuki",
	"Alecat",
	"Kenorah",
	"tahis9",
	"Arahpthos",
].sort((a, b) => collator.compare(a, b));

const FRONT_DESK = [
	"Awrie",
	"Geolubread",
	"aggymon",
	"Nicosar",
	"Sten",
	"Baphy",
	"AtomicCaleb",
	"GLPhoenix",
].sort((a, b) => collator.compare(a, b));

const STAGE_HAND = [
	"Kenorah",
	"tahis9",
	"Fuddlebob",
	"wooper",
	"Chokocchi",
	"Kuiperbole",
	"Awrie",
	"aggymon",
].sort((a, b) => collator.compare(a, b));

const HOST = [
	"aggymon",
	"Arahpthos",
	"Chuckstah",
	"Awrie",
	"GLPhoenix",
	"Geolubread",
	"Nicosar",
	"Kenorah",
].sort((a, b) => collator.compare(a, b));

const RUNNERS = [
	"Nicosar",
	"Mastodon",
	"Falco_GX",
	"Feetballer",
	"Spike_SSBU",
	"Logaaaaan64",
	"Logaaaaan65",
	"Logaaaaan66",
	"mobius",
	"KassXCII",
	"Saucy",
	"macko209",
	"Kenorah",
	"urbani",
	"aggymon",
	"vichisuki",
	"Ninten",
	"Paulmall",
	"hyphenHoik",
	"Baphy",
	"MikamiHero",
	"Alecat",
	"247Yugioh",
	"Geolubread",
	"Danicker",
].sort((a, b) => collator.compare(a, b));

export function Credits() {
	const creditsBGRef = useRef<HTMLDivElement>(null);
	const allCreditsRef = useRef<HTMLDivElement>(null);

	useListenFor("start-credits", () => {
		const tl = gsap.timeline();
		// Start credits
		tl.to(allCreditsRef.current, { width: 500, duration: 2 });
		tl.to(allCreditsRef.current, { marginTop: -8500, duration: 120, ease: "none" }, "+=1");
		tl.to(allCreditsRef.current, { width: 0, duration: 2 });
	});

	return (
		<CreditsContainer ref={creditsBGRef}>
			<AllCredits ref={allCreditsRef}>
				<EventImg>
					<img style={{ width: "90%", height: "auto" }} src={EventLogo} />
				</EventImg>
				<Title>
					Australian Speedruns
					<br />
					Open 2026
				</Title>
				<Title>AusSpeedruns Committee</Title>
				<NameContainer>
					<NameWithRoles>
						ASO Coordinator<Name>werster</Name>
					</NameWithRoles>
					<NameWithRoles>
						AusSpeedruns Director<Name>Sten</Name>
					</NameWithRoles>
					<NameWithRoles>
						ASM Coordinator<Name>Noops</Name>
					</NameWithRoles>
					<NameWithRoles>
						ASAP Coordinator<Name>Astrious</Name>
					</NameWithRoles>
					<NameWithRoles>
						Hardware Manager<Name>neɪ</Name>
					</NameWithRoles>
					<NameWithRoles>
						Software Manager<Name>Clubwho</Name>
					</NameWithRoles>
					<NameWithRoles>
						Runner Manager<Name>JTMagicman</Name>
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
					{TECH.map((name) => (
						<Name key={name}>{name}</Name>
					))}
				</NameContainer>
				<Title>Stage Hand</Title>
				<NameContainer>
					{STAGE_HAND.map((name) => (
						<Name key={name}>{name}</Name>
					))}
				</NameContainer>
				<Title>Front Desk</Title>
				<NameContainer>
					{FRONT_DESK.map((name) => (
						<Name key={name}>{name}</Name>
					))}
				</NameContainer>
				<Title>Hosts</Title>
				<NameContainer>
					{HOST.map((name) => (
						<Name key={name}>{name}</Name>
					))}
				</NameContainer>
				<Title>Runners</Title>
				<NameContainer>
					{RUNNERS.map((name) => (
						<Name key={name}>{name}</Name>
					))}
				</NameContainer>
				<Title>Special Thanks</Title>
				<NameContainer>
					<NameWithRoles>Cure Cancer Australia</NameWithRoles>
					{/* <NameWithRoles>PAX Australia</NameWithRoles> */}
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
					{/* <NameWithRoles>All enforcers</NameWithRoles> */}
					<NameWithRoles>All commentators</NameWithRoles>
					<NameWithRoles>All donators</NameWithRoles>
					<NameWithRoles>{"and especially you <3"}</NameWithRoles>
				</NameContainer>
			</AllCredits>
		</CreditsContainer>
	);
}
