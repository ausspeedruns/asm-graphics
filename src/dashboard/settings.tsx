import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { GreenButton, RedButton } from "./elements/styled-ui";

import { TextField, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin: 8px 0;
`;

export const Settings: React.FC = () => {
	const [creditsNameRep, setCreditsNameRep] = useReplicant<{ name: string; title: string }>("credits-name");

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const mutableName = creditsNameRep ?? { name: "", title: "" };
		setCreditsNameRep({ ...mutableName, name: e.target.value });
	}

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const mutableName = creditsNameRep ?? { name: "", title: "" };
		setCreditsNameRep({ ...mutableName, title: e.target.value });
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<GreenButton variant="contained" fullWidth onClick={() => nodecg.sendMessage("start-credits")}>
				Roll Credits
			</GreenButton>
			<hr style={{ margin: "24px 0" }} />
			<Row>
				<TextField fullWidth label="Credits Name" value={creditsNameRep?.name} onChange={handleNameChange} />
				<TextField fullWidth label="Credits Title" value={creditsNameRep?.title} onChange={handleTitleChange} />
			</Row>
			<Row>
				<GreenButton variant="contained" fullWidth onClick={() => nodecg.sendMessage("show-lowerthird")}>
					Show Lowerthird
				</GreenButton>
				<RedButton variant="contained" fullWidth onClick={() => nodecg.sendMessage("hide-lowerthird")}>
					Hide Lowerthird
				</RedButton>
			</Row>
			<hr style={{ margin: "24px 0" }} />
			<Row>
				<GreenButton
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("show-acknowledgementofcountry")}>
					Show AoC
				</GreenButton>
				<RedButton
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("hide-acknowledgementofcountry")}>
					Hide AoC
				</RedButton>
			</Row>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<Settings />);
