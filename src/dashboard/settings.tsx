import { createRoot } from "react-dom/client";

import styles from "./settings.module.css";

import { ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme.js";
import { Grid } from "@mui/material";
import { GameYearsSettings } from "./settings/schedule-import.js";
import { AusSpeedrunsWebsiteSettings } from "./settings/ausspeedruns-website.js";
import { PrizesSettings } from "./settings/prizes.js";
import { AcknowledgementOfCountry } from "./settings/acknowledgement-of-country.js";
import { EventUpload } from "./settings/event-upload.js";
import { HostReads } from "./settings/host-read.js";
import { IntermissionVideos } from "./settings/intermission-videos.js";
import { OBSSettings } from "./settings/obs.js";
import { X32Settings } from "./settings/x32.js";
import { TiltifySettings } from "./settings/tiltify.js";
import { TickerSettings } from "./settings/ticker.js";
// import MultipleContainers from "./settings/dnd-test.js";
import { VolunteerImporter } from "./settings/volunteer-importer.js";
import { TestNetwork } from "./settings/test-network.js";

const settingsPanels = [
	HostReads,
	IntermissionVideos,
	EventUpload,
	OBSSettings,
	X32Settings,
	TiltifySettings,
	PrizesSettings,
	AcknowledgementOfCountry,
	AusSpeedrunsWebsiteSettings,
	GameYearsSettings,
	TickerSettings,
	VolunteerImporter,
	TestNetwork,
];

export function Settings() {
	return (
		<ThemeProvider theme={darkTheme}>
			<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
				{settingsPanels.map((Panel, index) => (
					<Grid className={styles.gridItem} key={index} size={{ xs: 2, sm: 4, md: 4 }}>
						<Panel />
					</Grid>
				))}
			</Grid>
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<Settings />);
