import { useState } from "react";
import { Close } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { IconButton, Snackbar, Tab } from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import { useReplicant } from "@nodecg/react-hooks";

import { Donations } from "./donations.js";
import { ManualDonations } from "./manual-donations.js";

import type { Donation } from "@asm-graphics/types/Donations.js";
import styles from "./donation-tabs.module.css";

const HostDashTab = muiStyled(Tab)({
	fontWeight: "bold",
	"&.Mui-selected": {
		color: "white",
		background: "var(--asm-orange)",
	},
	transition: "background-color 0.25s, color 0.25s",
});

const HostDashTabList = muiStyled(TabList)({
	boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
	borderBottom: "1px solid var(--asm-orange)",
});

export const DonationTabs = () => {
	const [page, setPage] = useState("donations");
	const [donationsRep] = useReplicant("donations");
	const [manualDonationRep] = useReplicant("manual-donation-total");

	const [copyNotification, setCopyNotification] = useState(false);

	const copyDonateCommand = () => {
		void navigator.clipboard.writeText("!donate").then(() => {
			setCopyNotification(true);
		});
	};

	const closeCopyNotification = () => {
		setCopyNotification(false);
	};

	return (
		<div className={styles.container}>
			<TabContext value={page}>
				<HostDashTabList
					slotProps={{ indicator: { style: { display: "none" } } }}
					onChange={(_, newValue) => setPage(newValue)}
					aria-label="Incentives and Prizes"
					variant="fullWidth"
				>
					<HostDashTab label="Donations" value="donations" />
					<HostDashTab label="Manual Donations" value="manual" />
				</HostDashTabList>

				<TabPanel value="donations" sx={{ height: "100%", padding: 0 }}>
					<div className={styles.heading} style={{ cursor: "pointer" }} onClick={copyDonateCommand}>
						{(donationsRep ?? []).length} Donations
					</div>
					<Donations />
				</TabPanel>

				<TabPanel value="manual" sx={{ height: "100%", padding: 0 }}>
					<div className={styles.heading}>Manual Donations ${(manualDonationRep ?? 0).toLocaleString()}</div>
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
		</div>
	);
};
