import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { GreenButton, RedButton } from "./elements/styled-ui";

import { TextField, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";
import { useReplicant } from "use-nodecg";

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin: 8px 0;
`;

export const Settings: React.FC = () => {
	const [creditsNameRep, setCreditsNameRep] = useReplicant<{ name: string; title: string }>("credits-name", {
		name: "",
		title: "",
	});

	return (
		<ThemeProvider theme={darkTheme}>
			<GreenButton variant="contained" fullWidth onClick={() => nodecg.sendMessage("start-credits")}>
				Roll Credits
			</GreenButton>
			<hr style={{ margin: "24px 0" }} />
			<Row>
				<TextField
					fullWidth
					label="Credits Name"
					value={creditsNameRep.name}
					onChange={(e) => setCreditsNameRep({ ...creditsNameRep, name: e.target.value })}
				/>
				<TextField
					fullWidth
					label="Credits Title"
					value={creditsNameRep.title}
					onChange={(e) => setCreditsNameRep({ ...creditsNameRep, title: e.target.value })}
				/>
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
					onClick={() => nodecg.sendMessage("show-acknowledgementofcountry")}
				>
					Show AoC
				</GreenButton>
				<RedButton
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("hide-acknowledgementofcountry")}
				>
					Hide AoC
				</RedButton>
			</Row>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<Settings />);
