import { useState } from "react";
import styled from "styled-components";
import { Close } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { IconButton, Snackbar, Tab } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";

import { Donations } from "./donations";
import { ManualDonations } from "./manual-donations";

import type { Donation } from "@asm-graphics/types/Donations";

export const DonationTabs = () => {
	const [page, setPage] = useState("donations");
	const [donationsRep] = useReplicant<Donation[]>("donations");
	const [manualDonationRep] = useReplicant<number>("manual-donation-total", { defaultValue: 100 });

	const [copyNotification, setCopyNotification] = useState(false);

	const copyDonateCommand = () => {
		navigator.clipboard.writeText("!donate").then(() => {
			setCopyNotification(true);
		});
	};

	const closeCopyNotification = () => {
		setCopyNotification(false);
	};

	return (
		<Container>
			<TabContext value={page}>
				<TabList onChange={(_, newValue) => setPage(newValue)} aria-label="Incentives and Prizes">
					<Tab label="Donations" value="donations" />
					<Tab label="Manual Donations" value="manual" />
				</TabList>

				<TabPanel value="donations">
					<Heading style={{ cursor: "pointer" }} onClick={copyDonateCommand}>
						{(donationsRep ?? []).length} Donations
					</Heading>
					<Donations />
				</TabPanel>

				<TabPanel value="manual">
					<Heading>Manual Donations ${(manualDonationRep ?? 0).toLocaleString()}</Heading>
					<ManualDonations />
				</TabPanel>
			</TabContext>

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
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	height: 100%;

	button {
		color: white;
		background: var(--orange-600);
		flex: 1 1 0;
		font-family: var(--main-font);
		font-weight: bold;
		max-width: none;
	}

	button.Mui-selected {
		color: white;
		background: var(--asm-orange);
	}

	.MuiTabs-indicator {
		background-color: white;
	}

	.MuiTabs-root {
		width: 100%;
		border-bottom: 1px solid black;
	}

	.MuiTabPanel-root {
		height: calc(100% - 50px);
		padding: 0;
		overflow: auto;
	}
`;

const Heading = styled.div`
	background: var(--inset-background);
	margin: 0;
	padding: 8px;
	font-size: 20px;
	font-weight: bold;

	display: flex;
	gap: 8px;
	justify-content: center;
	align-items: center;

	& button {
		flex: 0;
	}
`;
