import React from "react";
import { createRoot } from "react-dom/client";

import { Checkbox, FormControlLabel, FormGroup, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";
import { SM64MovementAbilities } from "extensions/sm64-rando";
import { useReplicant } from "use-nodecg";
import { styled } from "styled-components";

const CheckboxGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
`;

function camelCaseToWords(s: string) {
	const result = s.replace(/([A-Z])/g, " $1");
	return result.charAt(0).toUpperCase() + result.slice(1);
}

export const DashRandomiserControl: React.FC = () => {
	const [sm64RandoRep] = useReplicant<SM64MovementAbilities | undefined>("rando:sm64-movement", undefined);

	function handleChange(item: string, checked: boolean) {
		if (checked) {
			nodecg.sendMessage("rando:unlock", { game: "SM64-Movement", item });
		} else {
			nodecg.sendMessage("rando:lock", { game: "SM64-Movement", item });
		}
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<FormGroup>
				<CheckboxGrid>
					{Object.entries(sm64RandoRep ?? {}).map((item) => {
						return (
							<FormControlLabel
								control={
									<Checkbox
										checked={item[1] ?? false}
										onChange={(_, checked) => {
											handleChange(item[0], checked);
										}}
									/>
								}
								label={camelCaseToWords(item[0])}
							/>
						);
					})}
				</CheckboxGrid>
			</FormGroup>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<DashRandomiserControl />);
