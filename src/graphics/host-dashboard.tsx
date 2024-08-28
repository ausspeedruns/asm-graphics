import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { Description, Edit, Tune } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";

import { HostEditDialog } from "./dashboards/host-edit-dialog";
import { ScriptDialog } from "./dashboards/script-dialog";
import { Timer } from "./dashboards/timer";
import { HostTabs } from "./dashboards/host-tabs";
import { Header } from "./dashboards/header";
import { DonationMatches } from "./dashboards/donation-matches";

import type { Commentator } from "@asm-graphics/types/OverlayProps";
import { UpNext } from "./dashboards/upnext";
import { AudioDialog } from "./dashboards/audio-dialog";
import { DonationTabs } from "./dashboards/donation-tabs";

const parents = (nodecg.bundleConfig.twitch?.parents ?? [])
	.map((parent) => {
		return `&parent=${parent}`;
	})
	.join("");

export const HostDash: React.FC = () => {
	const [donationTotalRep] = useReplicant<number>("donationTotal", { defaultValue: 100 });
	const [manualDonationRep] = useReplicant<number>("manual-donation-total", { defaultValue: 100 });

	const [hostRep] = useReplicant<Commentator | undefined>("host", undefined);

	const [hostOpen, setHostOpen] = useState(false);
	const [scriptsOpen, setScriptsOpen] = useState(false);
	const [audioOpen, setAudioOpen] = useState(false);

	const currentTimeElRef = useRef<HTMLParagraphElement>(null);
	const currentTimeRef = useRef("00:00:00");
	const [timeFormat, setTimeFormat] = useState(false); // False: 24hr, True: 12 Hour

	const [playingAd, setPlayingAd] = useState<number | undefined>();
	const adProgressBarRef = useRef<HTMLDivElement>(null);

	const [muted, setMuted] = useState(true);
	const [couchMuted, setCouchMuted] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			if (!currentTimeRef.current || !currentTimeElRef.current) return;

			const newTime = new Date().toLocaleTimeString(timeFormat ? "en-AU" : "en-GB");

			if (currentTimeRef.current === newTime) return;

			currentTimeRef.current = newTime;
			currentTimeElRef.current.innerText = newTime;
		}, 200);

		return () => clearInterval(interval);
	}, [timeFormat]);

	function playAd(ad: string, length: number) {
		const adLength = length + 10;

		setPlayingAd(adLength);
		nodecg.sendMessage("playAd", ad);

		setTimeout(() => {
			setPlayingAd(undefined);
		}, adLength * 1000); // 10 to account for transition into ad
	}

	useEffect(() => {
		if (!adProgressBarRef.current) return;

		console.log(adProgressBarRef.current.style.animationDuration, playingAd);
		adProgressBarRef.current.style.animationDuration = `${playingAd}s`;
	}, [adProgressBarRef.current, playingAd]);

	function muteOrUnmute() {
		setMuted(!muted);
		nodecg.sendMessage(muted ? "x32:unmute-host" : "x32:mute-host");
	}

	function muteOrUnmuteCouch() {
		setCouchMuted(!couchMuted);
		nodecg.sendMessage(couchMuted ? "x32:host-unmute-couch" : "x32:host-mute-couch");
	}

	return (
		<DashContainer>
			<TopBar>
				<p>YOUR HOST:</p>
				<h1>
					{hostRep?.name} <span className="pronouns">{hostRep?.pronouns}</span>
				</h1>
				<Button onClick={() => setHostOpen(true)}>
					<Edit />
				</Button>
				<Spacer />
				<Button onClick={() => setAudioOpen(true)}>
					<Tune />
					Audio
				</Button>
				<Button onClick={() => setScriptsOpen(true)}>
					<Description />
					Scripts
				</Button>
				<p
					ref={currentTimeElRef}
					onClick={() => {
						setTimeFormat(!timeFormat);
					}}
					style={{ cursor: "pointer", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
					{currentTimeRef.current}
				</p>
			</TopBar>

			{playingAd && (
				<AdProgressBarContainer>
					<AdProgressBar ref={adProgressBarRef} />
					<AdProgressBarLabel>Advert Playing</AdProgressBarLabel>
				</AdProgressBarContainer>
			)}

			<HostEditDialog open={hostOpen} submit={() => setHostOpen(false)} onClose={() => setHostOpen(false)} />
			<ScriptDialog playAd={playAd} open={scriptsOpen} onClose={() => setScriptsOpen(false)} />
			<AudioDialog open={audioOpen} onClose={() => setAudioOpen(false)} />

			<Column>
				<Paper>
					<Timer />
				</Paper>
				<Paper style={{ flex: "1 1 0", overflow: "hidden" }}>
					<HostTabs />
				</Paper>
			</Column>

			<Column>
				<div style={{ display: "flex", height: 75, gap: 4 }}>
					<Button fullWidth color={muted ? "error" : "success"} onClick={muteOrUnmute} variant="contained">
						{muted ? "UNMUTE" : "Mute"}
					</Button>
					<Button color={couchMuted ? "error" : "success"} onClick={muteOrUnmuteCouch} variant="contained">
						{couchMuted ? "Unmute Couch" : "Mute Couch"}
					</Button>
				</div>
				<Total>${((donationTotalRep ?? 0) + (manualDonationRep ?? 0)).toLocaleString()}</Total>
				<Paper>
					<Header text="Donation Matches" />
					<DonationMatches />
				</Paper>
				<Paper style={{ flex: "1 1 0", overflow: "hidden" }}>
					<DonationTabs />
				</Paper>
			</Column>

			<Column>
				<Paper style={{ aspectRatio: "16/9" }}>
					<iframe
						style={{ border: "none" }}
						src={`https://player.twitch.tv/?channel=ausspeedruns${parents}&muted=true`}
						width="100%"
						height="100%"
					/>
				</Paper>
				<Paper style={{ flex: "1 1 0" }}>
					<iframe
						style={{ border: "none" }}
						src={`https://www.twitch.tv/embed/ausspeedruns/chat?${parents.slice(1)}`}
						width="100%"
						height="100%"
					/>
				</Paper>
				<Paper>
					<UpNext />
				</Paper>
			</Column>
		</DashContainer>
	);
};

const Total = styled.div`
	font-family: var(--main-font);
	font-weight: bold;
	font-size: 45px;
	text-align: center;
	font-variant-numeric: tabular-nums;
`;

const Column = styled.div`
	display: flex;
	gap: 8px;
	flex-direction: column;
	min-height: 100%;
`;

const DashContainer = styled.div`
	min-width: 100vw;
	min-height: 100vh;
	padding: 84px 8px 8px 8px;

	font-family:
		Noto Sans,
		sans-serif;

	display: grid;
	grid-template-columns: 1fr 1.5fr 1fr;
	gap: 8px;

	background: #ececec;

	box-sizing: border-box;
	* {
		box-sizing: border-box;
	}
`;

const TopBar = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	background: var(--asm-orange);
	width: 100%;
	height: 72px;
	padding: 8px 24px;

	display: flex;
	align-items: center;
	gap: 12px;

	p,
	h1 {
		color: white;
		line-height: 72px;
		margin: 0;
		padding: 0;
	}

	p {
		font-size: 20px;
	}

	h1 {
		display: flex;
		align-items: center;
		gap: 8px;

		.pronouns {
			font-size: 50%;
		}
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		font-weight: bold;
		font-size: 16px;

		min-width: 0;

		padding: 8px;
		color: white;
		background: var(--orange-600);
		border: 2px solid white;
		border-radius: 6px;

		&:hover {
			background: white;
			border: 2px solid var(--orange-400);
			color: var(--orange-400);
		}
	}
`;

const Spacer = styled.div`
	flex-grow: 1;
`;

const AdProgressBarContainer = styled.div`
	width: 100%;
	height: 20px;
	position: absolute;
	top: 72px;
	left: 0;

	display: flex;
	justify-content: center;
	background-color: gray;

	z-index: 10;
`;

const AdProgressBar = styled.div`
	width: 100%;
	background-color: red;

	animation: progressBarAnimation;
	animation-timing-function: linear;
	animation-duration: 15s;

	@keyframes progressBarAnimation {
		0% {
			width: 100%;
		}
		100% {
			width: 0%;
		}
	}
`;

const AdProgressBarLabel = styled.div`
	position: absolute;
	text-align: center;
	white-space: nowrap;
	font-weight: bold;
	color: white;
`;

createRoot(document.getElementById("root")!).render(<HostDash />);
