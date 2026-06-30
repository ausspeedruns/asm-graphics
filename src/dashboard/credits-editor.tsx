import { darkTheme } from "./theme";
import { createRoot } from "react-dom/client";
import { Button, MenuItem, Select, Stack, TextField, ThemeProvider } from "@mui/material";
import { Add } from "@mui/icons-material";
import { arrayMove } from "@dnd-kit/sortable";
import { Section } from "./credits-editor/section";
import { useReplicant } from "@nodecg/react-hooks";
import { useEffect, useState } from "react";
import type { Credits, CreditsName, CreditsSection } from "@asm-graphics/shared/credits";
import type NodeCG from "nodecg/types";

export function DashCreditsEditor() {
	const [creditsData, setCreditsData] = useState<Credits | null>(null);
	const [creditsRep] = useReplicant("credits");
	const [logoRep] = useReplicant<NodeCG.AssetFile[]>("assets:logo", { bundle: "asm-graphics" });

	useEffect(() => {
		if (!creditsRep) return;
		setCreditsData(creditsRep);
	}, [creditsRep]);

	function handleNewSection() {
		if (!creditsData) return;

		const newSection: CreditsSection = {
			title: "New Section",
			names: [],
		};

		setCreditsData((prev) => {
			if (!prev) return null;
			return { ...prev, sections: [...prev.sections, newSection] };
		});
	}

	function handleDeleteSection(index: number) {
		if (!creditsData) return;

		setCreditsData((prev) => {
			if (!prev) return null;
			const newSections = [...prev.sections];
			newSections.splice(index, 1);
			return { ...prev, sections: newSections };
		});
	}

	function handleMoveSection(index: number, direction: "up" | "down") {
		if (!creditsData) return;

		setCreditsData((prev) => {
			if (!prev) return null;
			const newSections = [...prev.sections];
			const newIndex = direction === "up" ? index - 1 : index + 1;

			if (newIndex < 0 || newIndex >= newSections.length) return prev;

			// Swap sections
			const temp = newSections[index]!;
			newSections[index] = newSections[newIndex]!;
			newSections[newIndex] = temp;
			return { ...prev, sections: newSections };
		});
	}

	function handleEventNameChange(eventName: string) {
		setCreditsData((prev) => {
			if (!prev) return null;
			return { ...prev, eventName };
		});
	}

	function handleSectionTitleChange(index: number, title: string) {
		setCreditsData((prev) => {
			if (!prev) return null;

			const newSections = [...prev.sections];
			newSections[index] = { ...newSections[index]!, title };

			return { ...prev, sections: newSections };
		});
	}

	function handleAddName(sectionIndex: number) {
		const newName: CreditsName = {
			name: "",
			role: "",
		};

		setCreditsData((prev) => {
			if (!prev) return null;

			const newSections = [...prev.sections];
			const section = newSections[sectionIndex];

			if (!section) return prev;

			newSections[sectionIndex] = {
				...section,
				names: [...section.names, newName],
			};

			return { ...prev, sections: newSections };
		});
	}

	function handleNameChange(sectionIndex: number, nameIndex: number, field: keyof CreditsName, value: string) {
		setCreditsData((prev) => {
			if (!prev) return null;

			const newSections = [...prev.sections];
			const section = newSections[sectionIndex];
			const existingName = section?.names[nameIndex];

			if (!section || !existingName) return prev;

			const newNames = [...section.names];
			newNames[nameIndex] = { ...existingName, [field]: value };
			newSections[sectionIndex] = { ...section, names: newNames };

			return { ...prev, sections: newSections };
		});
	}

	function handleDeleteName(sectionIndex: number, nameIndex: number) {
		setCreditsData((prev) => {
			if (!prev) return null;

			const newSections = [...prev.sections];
			const section = newSections[sectionIndex];

			if (!section) return prev;

			newSections[sectionIndex] = {
				...section,
				names: section.names.filter((_, index) => index !== nameIndex),
			};

			return { ...prev, sections: newSections };
		});
	}

	function handleMoveName(sectionIndex: number, activeIndex: number, overIndex: number) {
		setCreditsData((prev) => {
			if (!prev) return null;

			const newSections = [...prev.sections];
			const section = newSections[sectionIndex];

			if (!section || activeIndex === overIndex) return prev;

			newSections[sectionIndex] = {
				...section,
				names: arrayMove(section.names, activeIndex, overIndex),
			};

			return { ...prev, sections: newSections };
		});
	}

	function handleUpdate() {
		if (!creditsData) return;

		void nodecg.sendMessage("credits:update", creditsData);
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<Stack spacing={2}>
				<Stack direction="row" spacing={1}>
					<Select
						label="Event Logo"
						value={creditsData?.logo ?? ""}
						onChange={(event) => setCreditsData((prev) => ({ ...prev!, logo: event.target.value }))}
					>
						{logoRep?.map((logo) => (
							<MenuItem key={logo.name} value={logo.url}>
								<Stack direction="row" spacing={1}>
									<img
										src={logo.url}
										alt={logo.name}
										style={{
											width: "50px",
											height: "24px",
											objectFit: "contain",
											marginRight: "8px",
										}}
									/>
									{logo.name}
									{logo.ext}
								</Stack>
							</MenuItem>
						))}
					</Select>
					<TextField
						label="Event Name"
						fullWidth
						value={creditsData?.eventName ?? ""}
						onChange={(event) => {
							const { value } = event.currentTarget;
							handleEventNameChange(value);
						}}
					/>
				</Stack>
				<Stack spacing={1} style={{ marginTop: "8px" }}>
					{creditsData?.sections.map((section, index) => (
						<Section
							key={index}
							title={section.title}
							names={section.names}
							onTitleChange={(title) => handleSectionTitleChange(index, title)}
							onMoveUp={() => handleMoveSection(index, "up")}
							onMoveDown={() => handleMoveSection(index, "down")}
							onDelete={() => handleDeleteSection(index)}
							onAddName={() => handleAddName(index)}
							onNameChange={(nameIndex, field, value) => handleNameChange(index, nameIndex, field, value)}
							onDeleteName={(nameIndex) => handleDeleteName(index, nameIndex)}
							onMoveName={(activeIndex, overIndex) => handleMoveName(index, activeIndex, overIndex)}
						/>
					))}
				</Stack>
				<Button color="success" fullWidth startIcon={<Add />} onClick={handleNewSection}>
					Add Section
				</Button>
				<Button color="success" variant="contained" fullWidth onClick={handleUpdate}>
					Update
				</Button>
			</Stack>
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<DashCreditsEditor />);
