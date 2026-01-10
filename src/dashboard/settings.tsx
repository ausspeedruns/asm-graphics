import { createRoot } from "react-dom/client";
import styled from "@emotion/styled";

import { ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";
import { Grid } from "@mui/material";
import { GameYearsSettings } from "./settings/schedule-import";
import { AusSpeedrunsWebsiteSettings } from "./settings/ausspeedruns-website";
import { PrizesSettings } from "./settings/prizes";
import { AcknowledgementOfCountry } from "./settings/acknowledgement-of-country";
import { EventUpload } from "./settings/event-upload";
import { HostReads } from "./settings/host-read";
import { IntermissionVideos } from "./settings/intermission-videos";
import { OBSSettings } from "./settings/obs";
import { X32Settings } from "./settings/x32";
import { TiltifySettings } from "./settings/tiltify";
import MultipleContainers from "./settings/dnd-test";

const GridItem = styled(Grid)`
	padding: 16px;
	border: 1px solid #ffffff70;
	border-radius: 8px;

	& h3 {
		margin-top: 0;
	}
`;

export function Settings() {
	return (
		<ThemeProvider theme={darkTheme}>
			<MultipleContainers />
			<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<HostReads />
				</GridItem>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<IntermissionVideos />
				</GridItem>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<EventUpload />
				</GridItem>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<OBSSettings />
				</GridItem>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<X32Settings />
				</GridItem>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<TiltifySettings />
				</GridItem>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<PrizesSettings />
				</GridItem>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<AcknowledgementOfCountry />
				</GridItem>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<AusSpeedrunsWebsiteSettings />
				</GridItem>
				<GridItem size={{ xs: 2, sm: 4, md: 4 }}>
					<GameYearsSettings />
				</GridItem>
			</Grid>
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<Settings />);
