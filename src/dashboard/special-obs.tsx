import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { darkTheme } from "./theme";
import { Checkbox, FormControlLabel, ThemeProvider } from "@mui/material";

const SpecialOBSContainer = styled.div``;

export const SpecialOBS: React.FC = () => {
	const [widescreen3p, setWidescreen3p] = useState(false);

	const widescreen3pHandler = (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		nodecg.sendMessage("widescreen3p-mask", checked);
		setWidescreen3p(checked);
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<SpecialOBSContainer>
				<FormControlLabel
					control={<Checkbox color="primary" value={widescreen3p} onChange={widescreen3pHandler} />}
					label="Enable Stream Masking for Widescreen 3p. ONLY ASM STATION 1, 2, 3!"
					labelPlacement="start"
				/>
			</SpecialOBSContainer>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<SpecialOBS />);
