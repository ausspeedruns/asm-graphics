import {
	Box,
	Chip,
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useOverlayStyleStore } from "../stores/overlay-style-store";

export function StyleSettings() {
	const fontsFiles = useOverlayStyleStore((state) => state.fontsFiles);
	const backgroundFiles = useOverlayStyleStore((state) => state.backgroundFiles);
	const fonts = useOverlayStyleStore((state) => state.fonts);
	const colours = useOverlayStyleStore((state) => state.colours);
	const setFontFile = useOverlayStyleStore((state) => state.setFontFile);
	const setColour = useOverlayStyleStore((state) => state.setColour);

	function handleFontChange(type: keyof typeof fonts, value: string) {
		setFontFile(
			type,
			fontsFiles.find((file) => file.url === value),
		);
	}

	function renderFontSelect(type: keyof typeof fonts, label: string, helperText: string) {
		const selectedFont = fonts[type];

		return (
			<FormControl fullWidth>
				<InputLabel id={`${type}-font-label`}>{label}</InputLabel>
				<Select
					labelId={`${type}-font-label`}
					value={selectedFont?.url ?? ""}
					label={label}
					onChange={(event) => handleFontChange(type, event.target.value)}
				>
					<MenuItem value="">
						<em>Unset</em>
					</MenuItem>
					{fontsFiles.map((file) => (
						<MenuItem key={file.url} value={file.url}>
							{file.name}
						</MenuItem>
					))}
				</Select>
				<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
					{selectedFont ? selectedFont.name : helperText}
				</Typography>
			</FormControl>
		);
	}

	function renderColourField(key: keyof typeof colours, label: string) {
		const value = colours[key];

		return (
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
				<Typography variant="caption">{label}</Typography>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
					<input
						type="color"
						value={value}
						onChange={(event) => setColour(key, event.target.value)}
						style={{ width: 200, height: 40, padding: 0, border: "none", background: "none" }}
					/>
					<Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
						{value}
					</Typography>
				</Box>
			</Box>
		);
	}

	return (
		<Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Box>
					<Typography variant="h6" component="h2">
						Style Settings
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Configure the shared fonts and colours used by the overlay.
					</Typography>
				</Box>

				<Divider />

				<Box>
					<Typography variant="subtitle1" component="h3" sx={{ mb: 1 }}>
						Fonts
					</Typography>
					<Stack spacing={2}>
						{renderFontSelect("body", "Body Font", "Choose the default readable font.")}
						{renderFontSelect("game", "Game Font", "Choose the font used for game titles and scores.")}
						{renderFontSelect("nameplate", "Nameplate Font", "Choose the font used for player nameplates.")}
					</Stack>
				</Box>

				<Divider />

				<Box>
					<Typography variant="subtitle1" component="h3" sx={{ mb: 1 }}>
						Colours
					</Typography>
					<Stack spacing={2}>
						{renderColourField("background", "Background")}
						{renderColourField("nameplate", "Nameplate")}
						{renderColourField("nameplateTalking", "Nameplate Talking")}
						{renderColourField("nameplatePronouns", "Nameplate Pronouns")}
						{renderColourField("couch", "Couch")}
						{renderColourField("couchTalking", "Couch Talking")}
					</Stack>
				</Box>

				{backgroundFiles.length > 0 && (
					<>
						<Divider />
						<Box>
							<Typography variant="subtitle1" component="h3" sx={{ mb: 1 }}>
								Loaded Backgrounds
							</Typography>
							<Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
								{backgroundFiles.map((file) => (
									<Chip key={file.url} label={file.name} variant="outlined" size="small" />
								))}
							</Stack>
						</Box>
					</>
				)}
			</Stack>
		</Paper>
	);
}
