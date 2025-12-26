import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import {
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	IconButton,
	Input,
	Slider,
	TextField,
	ThemeProvider,
} from "@mui/material";
import { darkTheme } from "./theme";
import { useReplicant } from "@nodecg/react-hooks";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { HostRead } from "@asm-graphics/shared/HostRead";
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DragHandle, Refresh, VolumeUp } from "@mui/icons-material";
import type { IntermissionVideo } from "@asm-graphics/shared/IntermissionVideo";
import type { LowerThirdPerson } from "@asm-graphics/shared/FullscreenGraphic";

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin: 8px 0;
`;

export function Settings() {
	// const [obsDoLocalRecordingsRep, setObsDoLocalRecordingsRep] = useReplicant<boolean>("obs:localRecordings");

	const [creditsInfo, setCreditsInfo] = useState({ name: "", title: "" });
	const [creditsNameRep] = useReplicant<LowerThirdPerson>("lowerThirdPerson");

	useEffect(() => {
		if (
			creditsNameRep &&
			(creditsNameRep.name !== creditsInfo.name || creditsNameRep.title !== creditsInfo.title)
		) {
			setCreditsInfo(creditsNameRep);
		}
	}, [creditsNameRep]);

	function handleLowerthirdChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: "name" | "title",
	) {
		setCreditsInfo((prev) => ({ ...prev, [field]: e.target.value }));
	}

	function updateCreditsInfo() {
		void nodecg.sendMessage("lowerthird:save-person", creditsInfo);
	}

	const canUpdate =
		creditsInfo.name !== (creditsNameRep?.name ?? "") || creditsInfo.title !== (creditsNameRep?.title ?? "");

	return (
		<ThemeProvider theme={darkTheme}>
			<h3 style={{ margin: "0", textAlign: "center" }}>Acknowledgement of Country</h3>
			<Row>
				<Button
					color="success"
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("show-acknowledgementofcountry")}
				>
					Show AoC
				</Button>
				<Button
					color="error"
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("hide-acknowledgementofcountry")}
				>
					Hide AoC
				</Button>
			</Row>
			<hr style={{ margin: "24px 0" }} />
			<div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
				<h3 style={{ margin: "0", textAlign: "center" }}>Lowerthird</h3>
				<TextField
					fullWidth
					label="Lowerthird Name"
					value={creditsInfo?.name}
					onChange={(e) => handleLowerthirdChange(e, "name")}
				/>
				<TextField
					fullWidth
					label="Lowerthird Title"
					value={creditsInfo?.title}
					onChange={(e) => handleLowerthirdChange(e, "title")}
				/>
			</div>
			<Button color="primary" variant="contained" fullWidth onClick={updateCreditsInfo} disabled={!canUpdate}>
				Update
			</Button>
			<Row>
				<Button
					color="success"
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("lowerthird:show")}
				>
					Show Lowerthird
				</Button>
				<Button
					color="error"
					variant="contained"
					fullWidth
					onClick={() => nodecg.sendMessage("lowerthird:hide")}
				>
					Hide Lowerthird
				</Button>
			</Row>
			<hr style={{ margin: "24px 0" }} />
			<h3 style={{ margin: "0", textAlign: "center" }}>Credits</h3>
			<Button color="success" variant="contained" fullWidth onClick={() => nodecg.sendMessage("start-credits")}>
				Roll Credits
			</Button>
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<Settings />);
