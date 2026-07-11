import { useMemo } from "react";

import StopwatchIcon from "../../graphics/media/icons/stopwatch.svg?react";
import RunnerIcon from "../../graphics/media/icons/runner.svg?react";
import ConsoleIcon from "../../graphics/media/icons/console.svg?react";
import ScheduleIcon from "@mui/icons-material/Schedule";
import GridViewIcon from "@mui/icons-material/GridView";
import NotesIcon from "@mui/icons-material/Notes";
import CategoryIcon from "@mui/icons-material/Route";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import styles from "./run-info.module.css";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { formatDate } from "date-fns";
import type { RunData } from "@asm-graphics/types/RunData";
import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { customDataSchema } from "../../shared/types/custom-data";

const MAX_NOTES_LENGTH = 60;

interface RunInfoProps {
	style?: React.CSSProperties;
	run?: RunData;
	openEditDialog?: (run: RunData) => void;
}

export function RunInfo(props: RunInfoProps) {
	const run = props.run;
	const runners = run?.teams.flatMap((team) => team.players.map((player) => player.name)).join(", ");

	const customRunData = customDataSchema.safeParse(run?.customData ?? {}).data;

	const { layout, specialRequirements } = useMemo(() => {
		const rawRequirements = customRunData?.specialRequirements ?? "";
		const layoutMatch = /LAYOUT:\s*([^\n]+)/i.exec(rawRequirements);
		const extractedLayout = layoutMatch?.[1]?.trim() || null;

		// Remove the LAYOUT: line from special requirements
		const cleanedRequirements = rawRequirements.replace(/LAYOUT:\s*[^\n]*/gi, "").trim();

		return {
			layout: extractedLayout,
			specialRequirements: cleanedRequirements || null,
		};
	}, [run?.customData]);

	return (
		<div className={styles.container} style={props.style}>
			{props.openEditDialog && run && (
				<IconButton size="small" className={styles.editButton} onClick={() => props.openEditDialog?.(run)}>
					<Edit fontSize="inherit" />
				</IconButton>
			)}
			<div className={styles.header}>
				<div className={styles.game}>{run?.game ?? "No Run Selected"}</div>
				<div className={styles.category}>
					<CategoryIcon style={{ fontSize: 14 }} />
					{run?.category}
					<span className={styles.divider} />
					<StopwatchIcon height={14} width={14} />
					{run?.estimate}
					<span className={styles.divider} />
					<CalendarMonthIcon style={{ fontSize: 14 }} />
					{run?.release}
				</div>
			</div>

			<div className={styles.infoGrid}>
				<div className={styles.infoItem}>
					<RunnerIcon height={16} width={16} />
					<span className={styles.label}>Runners</span>
					<span className={styles.value}>{runners || "—"}</span>
				</div>

				<div className={styles.infoItem}>
					<ScheduleIcon style={{ fontSize: 16 }} />
					<span className={styles.label}>Start</span>
					<span className={styles.scheduleValue}>
						{formatDate(run?.scheduledS ? run.scheduledS * 1000 : 0, "h:mm a")}
					</span>
				</div>

				<div className={styles.infoItem}>
					<ConsoleIcon height={14} width={14} />
					{customRunData?.techPlatform === run?.system ? (
						<>
							<span className={styles.label}>Tech &amp; Display</span>
							<span className={styles.value}>{run?.system || "—"}</span>
						</>
					) : (
						<>
							<span className={styles.label}>Tech</span>
							<span className={styles.value}>{customRunData?.techPlatform ?? "—"}</span>
							<span className={styles.divider} />
							<span className={styles.label}>Display</span>
							<span className={styles.value}>{customRunData?.gameDisplay ?? "—"}</span>
						</>
					)}
					<Tooltip title="Tech Platform is the hardware or emulator used for tech setup. Display Platform is what is shown to the audience (Normally the original release platform of the game version).">
						<InfoOutlinedIcon style={{ fontSize: 14, cursor: "pointer", opacity: 0.4 }} />
					</Tooltip>
				</div>

				{layout && (
					<div className={styles.infoItem}>
						<GridViewIcon style={{ fontSize: 16 }} />
						<span className={styles.label}>Layout</span>
						<span className={styles.layoutValue}>{layout}</span>
					</div>
				)}

				<div className={styles.infoItem}>
					<NotesIcon style={{ fontSize: 16 }} />
					<span className={styles.label}>Notes</span>
					{specialRequirements ? (
						specialRequirements.length > MAX_NOTES_LENGTH ? (
							<Tooltip
								title={<span style={{ whiteSpace: "pre-wrap" }}>{specialRequirements}</span>}
								arrow
								placement="bottom"
							>
								<span className={styles.notesValue}>
									{specialRequirements.slice(0, MAX_NOTES_LENGTH)}…
								</span>
							</Tooltip>
						) : (
							<span className={styles.value}>{specialRequirements}</span>
						)
					) : (
						<span className={styles.muted}>None</span>
					)}
				</div>

				<div className={styles.infoItem}>
					<OpenInNewIcon style={{ fontSize: 16 }} />
					<span className={styles.label}>Original Submission</span>
					{customRunData?.submission ? (
						<a
							href={customRunData.submission}
							target="_blank"
							rel="noopener noreferrer"
							className={styles.value}
						>
							View Submission
						</a>
					) : (
						<span className={styles.muted}>Unknown</span>
					)}
				</div>
			</div>
		</div>
	);
}
