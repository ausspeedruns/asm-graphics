import { useRef, useState } from "react";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import styled from "styled-components";
import { Incentives } from "./incentives";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import { IconButton } from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import { Refresh } from "@mui/icons-material";
import { format } from "date-fns";
import { PrizesHost } from "./prizes";

const Container = styled.div`
	height: 100%;
	position: relative;
`;

const Heading = styled.div`
	background: var(--inset-background);
	margin: 0;
	padding: 8px;
	font-size: 20px;
	font-weight: bold;
	border-radius: 4px;

	display: flex;
	gap: 8px;
	justify-content: center;
	align-items: center;
`;

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

export const HostTabs = () => {
	const [page, setPage] = useState("0");
	const [incentivesUpdatedRep] = useReplicant<number | undefined>("incentives:updated-at", undefined);
	const incentiveLoadingRef = useRef<HTMLButtonElement>(null);

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
		void nodecg.sendMessage("refreshIncentives");
		if (incentiveLoadingRef.current) incentiveLoadingRef.current.classList.add("rotate");
	};

	return (
		<Container>
			<TabContext value={page}>
				<HostDashTabList
					slotProps={{ indicator: { style: { display: "none" } } }}
					onChange={(_, newValue) => setPage(newValue)}
					aria-label="Incentives and Prizes"
					variant="fullWidth"
				>
					<HostDashTab style={{ maxWidth: "none" }} label="Incentives" value="0" />
					<HostDashTab style={{ maxWidth: "none" }} label="Prizes" value="1" />
				</HostDashTabList>

				<TabPanel value="0" sx={{ height: "100%", padding: 0 }}>
					<Heading>
						Last Updated: {incentivesUpdatedRep ? format(incentivesUpdatedRep, "E h:mm:ss a") : "UNKNOWN"}
						<IconButton size="small" onClick={updateIncentives} ref={incentiveLoadingRef}>
							<Refresh fontSize="small" />
						</IconButton>
					</Heading>
					<Incentives
						style={{ height: "calc(100% - 56px)", overflowY: "auto", overflowX: "hidden", padding: 8 }}
					/>
				</TabPanel>

				<TabPanel value="1" sx={{ height: "100%", padding: 0 }}>
					<PrizesHost style={{ paddingRight: 8 }} />
				</TabPanel>
			</TabContext>
		</Container>
	);
};
