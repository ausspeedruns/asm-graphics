import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogProps,
	DialogTitle,
	Tab,
} from "@mui/material";
import { useState } from "react";
import styled from "styled-components";

interface ScriptDialogProps extends DialogProps {
	playAd: (name: string, length: number) => void;
}

export const ScriptDialog = (props: ScriptDialogProps) => {
	const [tab, setTab] = useState("goc");

	return (
		<Dialog maxWidth="md" {...props}>
			<DialogTitle>Charity Scripts</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<div>
						<p>Video Ads</p>
						<Button variant="outlined" onClick={() => props.playAd("GOC", 36)}>
							Game On Cancer (36 seconds)
						</Button>
						<Button variant="outlined" onClick={() => props.playAd("Laptop", 60)}>
							Laptop (60 seconds)
						</Button>
						<Button variant="outlined" onClick={() => props.playAd("Raider_GE78", 84)}>
							Raider_GE78 (84 seconds)
						</Button>
						<Button variant="outlined" onClick={() => props.playAd("Vector_17", 85)}>
							Vector_17 (85 seconds)
						</Button>
						<Button variant="outlined" onClick={() => props.playAd("Prestige_13", 81)}>
							Prestige_13 (81 seconds)
						</Button>
						<Button variant="outlined" onClick={() => props.playAd("Stealth_Laptop", 87)}>
							Stealth_Laptop (87 seconds)
						</Button>
						<Button variant="outlined" onClick={() => props.playAd("Katana_Laptop", 86)}>
							Katana_Laptop (86 seconds)
						</Button>
						<Button variant="outlined" onClick={() => props.playAd("Thin_15", 58)}>
							Thin_15 (58 seconds)
						</Button>
					</div>
					<hr />
					<div>
						<p>Scripts</p>
					</div>
					<Container>
						<TabContext value={tab}>
							<TabList onChange={(_, newValue) => setTab(newValue)} aria-label="Scripts">
								<Tab label="Game On Cancer" value="goc" />
								<Tab label="Prizes" value="prizes" />
								<Tab label="Twitch Revenue" value="twitch" />
								<Tab label="Incentives" value="incentives" />
								<Tab label="MSI" value="msi" />
							</TabList>

							<TabPanel value="goc">
								<p>
									Mention that we are raising money for Game on Cancer, their activities, and how to
									donate (type !donate in the Twitch chat to bring up the donation link &ndash;
									donate.ausspeedruns.com)
								</p>
								<p>Sample Game on Cancer script:</p>
								<blockquote>
									“For ASM 2024 we're raising money for Game on Cancer, a charity which funds
									early-career cancer researchers who are working across all areas of cancer research
									to make this the last generation to die from cancer. If you'd like to donate, you
									can go to donate.ausspeedruns.com”
								</blockquote>
							</TabPanel>

							<TabPanel value="prizes">
								<p>
									Mention the prizes we have for donating (type !prizes in the Twitch chat to bring up
									the prizes link - prizes.ausspeedruns.com)
								</p>
								<p>Sample prizes script:</p>
								<blockquote>
									“We also have a number of prizes to giveaway for those who donate. Anyone within
									Australia who donates at least $10 will automatically go into the running to win one
									of our Steam game bundles, we have 5 different bundles available to win.
									<br /> For all the information, head on over to prizes.ausspeedruns.com”
								</blockquote>
							</TabPanel>

							<TabPanel value="twitch">
								<p>Mention that Twitch revenue will also go to Game on Cancer</p>
								<p>Sample Twitch revenue script:</p>
								<blockquote>
									“In addition to donating, the Twitch revenue we receive throughout the event will
									also be given to Game on Cancer, which includes bits and subscriptions to the
									AusSpeedruns channel, as another way to support Game on Cancer.”
								</blockquote>
							</TabPanel>

							<TabPanel value="incentives">
								<p>
									Mentioning the donation incentives (type !incentives in the Twitch chat to bring up
									the incentive link &ndash; incentives.ausspeedruns.com)
								</p>
								<p>
									Sample incentives script: [Note: this is obviously as example, and won't be the
									case]
								</p>
								<blockquote>
									“We have several donation incentives over the course of this marathon. To put money
									towards one of these incentives, simply mention it in the comments section on
									Tiltify when making your donation.
									<br />
									The next one coming up is a bid war to choose the Mio's hairstyle in Xenoblade
									Chronicles 3, and currently 'short hair' is ahead on $43.
									<br />
									To see the full list of all the incentives, head to incentives.ausspeedruns.com”
								</blockquote>
							</TabPanel>

							<TabPanel value="msi">
								<p>
									Read out the sponsor plug for MSI. The ideal time for this is during changeover
									between both a game and hosts, i.e. if your shift ends between games, make this the
									last thing you say on the mic, before playing one of the MSI ads and changing over.
								</p>
								<p>Sample MSI Script:</p>
								<blockquote>
									“AusSpeedruns extends its gratitude to MSI for sponsoring ASM 2024.
									<br />
									MSI Computers stands as a global powerhouse in gaming and content creation, reaching
									across more than 120 countries. Renowned for their cutting-edge products including
									laptops, desktops, graphics cards, monitors, motherboards, peripherals and more -
									MSI works closely with the gaming community to optimise product design, embodying
									their commitment as a 'True Gaming' brand”
								</blockquote>
							</TabPanel>
						</TabContext>
					</Container>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={(e) => props.onClose?.(e, "escapeKeyDown")} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const Container = styled.div`
	font-family: var(--main-font);
	font-weight: normal;
	color: black;
	border: 1px solid black;
	border-bottom: 2px solid black;

	margin: 0 16px;

	button {
		color: white;
		background: var(--orange-600);
		flex: 1 1 0;
		font-family: var(--main-font);
		font-weight: bold;
		border: 1px solid black;
	}

	button.Mui-selected {
		color: white;
		background: var(--asm-orange);
	}

	.MuiTabs-indicator {
		background-color: white;
	}

	.MuiTabs-root {
		border-bottom: 1px solid black;
	}

	.MuiTabPanel-root {
		padding: 16px;
	}

	blockquote {
		border-left: 4px solid var(--asm-orange);
		padding: 16px;
	}
`;
