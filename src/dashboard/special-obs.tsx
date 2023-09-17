import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { darkTheme } from "./theme";
import { ThemeProvider } from "@mui/material";

const SpecialOBSContainer = styled.div``;

export const SpecialOBS: React.FC = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			<SpecialOBSContainer>
			</SpecialOBSContainer>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<SpecialOBS />);
