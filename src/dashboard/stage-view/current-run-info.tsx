import useCurrentRun from "@asm-graphics/shared/hooks/useCurrentRun";

import styles from "./current-run-info.module.css";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { formatDate } from "date-fns";

interface CurrentRunInfoProps {
	style?: React.CSSProperties;
}

export function CurrentRunInfo(props: CurrentRunInfoProps) {
	const currentRun = useCurrentRun();

	return (
		<div className={styles.container} style={props.style}>
			<div className={styles.game}>{currentRun?.game}</div>
			<div>
				{currentRun?.category} – {currentRun?.estimate} – {currentRun?.release}
			</div>
			<div>{currentRun?.teams.flatMap((team) => team.players.map((player) => player.name)).join(", ")}</div>
			<div>
				<span className={styles.italic}>TECH Platform:</span> {currentRun?.customData["techPlatform"]} –{" "}
				<span className={styles.italic}>DISPLAY Platform:</span> {currentRun?.system}
				<Tooltip title="Tech Platform is the hardware or emulator used for tech setup. Display Platform is what is shown to the audience.">
					<InfoOutlinedIcon fontSize="small" style={{ cursor: "pointer", marginLeft: 4 }} />
				</Tooltip>
			</div>
			<div>
				Scheduled Start: {formatDate(currentRun?.scheduledS ? currentRun.scheduledS * 1000 : 0, "h:mm a")}
			</div>
		</div>
	);
}
