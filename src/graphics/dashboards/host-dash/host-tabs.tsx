import { useRef, useState } from "react";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import styled from "styled-components";
import { Incentives } from "./incentives";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import { IconButton } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { format } from "date-fns";
import { Prizes } from "./prizes";

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
		nodecg.sendMessage("refreshIncentives");
		if (incentiveLoadingRef.current) incentiveLoadingRef.current.classList.add("rotate");
	};

	return (
		<Container>
			<TabContext value={page}>
				<TabList onChange={(_, newValue) => setPage(newValue)} aria-label="Incentives and Prizes">
					<Tab label="Incentives" value="0" />
					<Tab label="Prizes" value="1" />
				</TabList>

				<TabPanel value="0">
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

				<TabPanel value="1">
					<Prizes style={{ paddingRight: 8 }} />
				</TabPanel>
			</TabContext>
		</Container>
	);
};

const Container = styled.div`
	height: 100%;
	position: relative;

	button {
		color: white;
		background: var(--orange-600);
		flex: 1 1 0;
		font-family: var(--main-font);
		font-weight: bold;
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
		height: calc(100% - 50px);
		padding: 0;
		overflow: auto;
	}
`;

const Heading = styled.div`
	background: grey;
	color: black;
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
