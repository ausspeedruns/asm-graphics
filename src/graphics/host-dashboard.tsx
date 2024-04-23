import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";

import {
	Paper,
	IconButton,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Snackbar,
} from "@mui/material";
import { Close, Refresh, Update } from "@mui/icons-material";
import { format } from "date-fns";

import type { Donation } from "@asm-graphics/types/Donations";

import { Header } from "./dashboards/header";
import { Donations } from "./dashboards/donations";
import { Upcoming } from "./dashboards/upcoming";
import { Incentives } from "./dashboards/incentives";
import { ManualDonations } from "./dashboards/manual-donations";
import { Timer } from "./dashboards/timer";
import { HostName } from "./dashboards/host-name";
import { DonationMatches } from "./dashboards/donation-matches";
import { HostDashAudio } from "./host-dashboard-audio";
import { Prizes } from "./dashboards/prizes";

const HostDashContainer = styled.div`
	height: 100vh;
	font-family:
		Noto Sans,
		sans-serif;
`;

const TopBar = styled.div`
	height: 60px;
	background: var(--asm-orange);
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
	padding: 0 16px;
	font-size: 29px;
	color: #ffffff;
`;

const TotalBox = styled(Paper)`
	font-weight: bold;
	font-size: 45px;
	text-align: center;
	padding: 8px 0;

	& .MutPaper-root {
		background: #555;
		color: #fff;
	}
`;

export const HostDash: React.FC = () => {
	const incentiveLoadingRef = useRef<HTMLButtonElement>(null);
	const [donationTotalRep] = useReplicant<number>("donationTotal");
	const [donationsRep] = useReplicant<Donation[]>("donations");
	const [manualDonationRep] = useReplicant<number>("manual-donation-total");
	const [incentivesUpdatedRep] = useReplicant<number>("incentives:updated-at", undefined);
	const [hostLevelRep] = useReplicant<number>("x32:host-level");

	const [currentTime, setCurrentTime] = useState("00:00:00");
	const [showScript, setShowScript] = useState(false);
	const [showAudio, setShowAudio] = useState(false);
	const [timeFormat, setTimeFormat] = useState(false); // False: 24hr, True: 12 Hour
	const [copyNotification, setCopyNotification] = useState(false);
	const [muted, setMuted] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date().toLocaleTimeString(timeFormat ? "en-AU" : "en-GB"));
		}, 500);
		return () => clearInterval(interval);
	}, [timeFormat]);

	useListenFor("incentivesUpdated", (statusCode) => {
		switch (statusCode) {
			case 200:
				if (incentiveLoadingRef.current) incentiveLoadingRef.current.classList.remove("rotate");
				break;
			case 400:
				break;
			default:
				nodecg.log.error("[Host dashboard] Unexpected status code: " + statusCode);
				break;
		}
	});

	const updateIncentives = () => {
		nodecg.sendMessage("updateIncentives");
		if (incentiveLoadingRef.current) incentiveLoadingRef.current.classList.add("rotate");
	};

	const showDialog = () => {
		setShowScript(true);
	};

	const hideDialog = () => {
		setShowScript(false);
	};

	const showAudioDialog = () => {
		setShowAudio(true);
	};

	const hideAudioDialog = () => {
		setShowAudio(false);
	};

	const copyDonateCommand = () => {
		navigator.clipboard.writeText("!donate").then(() => {
			setCopyNotification(true);
		});
	};

	const closeCopyNotification = () => {
		setCopyNotification(false);
	};

	// TODO Clean this shizz up
	function muteOrUnmute() {
		if (muted) {
			nodecg.sendMessage("x32:setFader", { mixBus: 0, float: hostLevelRep ?? 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 1, float: hostLevelRep ?? 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 3, float: hostLevelRep ?? 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 5, float: hostLevelRep ?? 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 7, float: hostLevelRep ?? 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 9, float: hostLevelRep ?? 0, channel: 5 });
			setMuted(false);
		} else {
			nodecg.sendMessage("x32:setFader", { mixBus: 0, float: 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 1, float: 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 3, float: 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 5, float: 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 7, float: 0, channel: 5 });
			nodecg.sendMessage("x32:setFader", { mixBus: 9, float: 0, channel: 5 });
			setMuted(true);
		}
	}

	return (
		<HostDashContainer>
			<TopBar>
				<span>{nodecg.bundleConfig.graphql?.event ?? ""}</span>
				<span onClick={showDialog} style={{ cursor: "pointer", textAlign: "center" }}>
					Scripts
				</span>
				<span onClick={showAudioDialog} style={{ cursor: "pointer", textAlign: "center" }}>
					Audio
				</span>
				<span
					onClick={() => {
						setTimeFormat(!timeFormat);
						setCurrentTime(new Date().toLocaleTimeString(!timeFormat ? "en-AU" : "en-GB"));
					}}
					style={{ cursor: "pointer", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
					<Update />
					{currentTime}
				</span>
			</TopBar>
			<div
				style={{
					display: "flex",
					background: "#ececec",
					height: "calc(100% - 76px)",
					boxSizing: "border-box",
				}}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						padding: 4,
						gap: 8,
						height: "100%",
						flexBasis: "33%",
					}}>
					<Paper style={{ overflowY: "auto", overflowX: "hidden", minHeight: 160 }}>
						<Header text="Your Name :)" />
						<HostName />
					</Paper>
					<Paper style={{ overflow: "hidden", height: 300, minHeight: 300 }}>
						<Timer />
					</Paper>
					<Paper style={{ height: "49%", overflow: "hidden" }}>
						<Header text="Upcoming Runs" url="https://ausspeedruns.com/ASDH2024/schedule" />
						<Upcoming style={{ height: "calc(100% - 56px)", overflowY: "auto", overflowX: "hidden" }} />
					</Paper>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						padding: 4,
						gap: 8,
						height: "100%",
						flexBasis: "33%",
					}}>
					<div style={{ display: "flex", height: 75 }}>
						<Button
							fullWidth
							color={muted ? "error" : "success"}
							onClick={muteOrUnmute}
							variant="contained">
							{muted ? "UNMUTE" : "Mute"}
						</Button>
					</div>
					<TotalBox>${((donationTotalRep ?? 0) + (manualDonationRep ?? 0)).toLocaleString()}</TotalBox>
					<Paper style={{ overflowY: "auto", overflowX: "hidden", maxHeight: 225 }}>
						<Header text="Donation Matches" />
						<DonationMatches
							style={{ height: "calc(100% - 56px)", overflowY: "auto", overflowX: "hidden" }}
						/>
					</Paper>
					<Paper style={{ overflow: "hidden", flexGrow: 1 }}>
						<Header
							text={`${(donationsRep ?? []).length} Donations`}
							style={{ cursor: "pointer" }}
							onClick={copyDonateCommand}
						/>
						<Donations />
					</Paper>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						padding: 4,
						gap: 8,
						height: "100%",
						flexBasis: "33%",
					}}>
					<Paper style={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
						<Header
							text={`Incentives – Last Updated: ${
								incentivesUpdatedRep ? format(incentivesUpdatedRep, "E h:mm:ss a") : "UNKNOWN"
							}`}
							url="https://keystone.ausspeedruns.com/incentives-dashboard">
							<IconButton size="small" onClick={updateIncentives} ref={incentiveLoadingRef}>
								<Refresh fontSize="small" />
							</IconButton>
						</Header>
						<Incentives style={{ height: "calc(100% - 56px)", overflowY: "auto", overflowX: "hidden" }} />
					</Paper>
					<Paper style={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
						<Header text={"Prizes"} />
						<Prizes style={{ height: "calc(100% - 56px)", overflowY: "auto", overflowX: "hidden" }} />
					</Paper>
					<Paper style={{ height: "49%", overflow: "hidden" }}>
						<Header text={`Manual Donations $${(manualDonationRep ?? 0).toLocaleString()}`} />
						<ManualDonations />
					</Paper>
				</div>
			</div>
			<Dialog open={showScript} onClose={hideDialog}>
				<DialogTitle id="alert-dialog-title">{"Example charity script"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<div>
							<p>Video Ads</p>
							<Button variant="outlined" onClick={() => nodecg.sendMessage("playAd", "GOC")}>
								Game On Cancer (36 seconds)
							</Button>
						</div>
						<hr />
						<br />
						&quot;We are AusSpeedruns, a group doing speedrun events to raise money for charity. For this
						event we&apos;re raising money for Game on Cancer, a charity which funds early-career cancer
						researchers who are working across all areas of cancer research. If you&apos;d like to donate,
						you can go to donate.ausspeedruns.com&quot;
						<br />
						<br />
						(While doing this, if someone else hasn&apos;t, would recommend typing !donate in chat to
						trigger the bot to post the link in chat)
						<br />
						<br />
						Remember, this is just a guide, so slight modifications to feel more natural to you is fine (in
						fact, encouraged).
						<br />
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={hideDialog} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={showAudio} onClose={hideAudioDialog} maxWidth="xl" fullWidth>
				<DialogTitle id="alert-dialog-title">Audio</DialogTitle>
				<DialogContent>
					<HostDashAudio />
				</DialogContent>
				<DialogActions>
					<Button onClick={hideAudioDialog} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				open={copyNotification}
				autoHideDuration={5000}
				onClose={closeCopyNotification}
				message="Copied '!donate' to clipboard"
				action={
					<IconButton size="small" aria-label="close" color="inherit" onClick={closeCopyNotification}>
						<Close fontSize="small" />
					</IconButton>
				}
			/>
		</HostDashContainer>
	);
};

createRoot(document.getElementById("root")!).render(<HostDash />);
