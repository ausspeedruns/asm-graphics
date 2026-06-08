import { FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useOverlayStyleStore } from "../../../stores/overlay-style-store";
import type NodeCG from "nodecg/types";

interface FontSettingProps {
	value: NodeCG.AssetFile | undefined;
	label: string;
	helperText: string;
	onChange: (file: NodeCG.AssetFile | undefined) => void;
}

export function FontSetting(props: FontSettingProps) {
	const fontsFiles = useOverlayStyleStore((state) => state.fontsFiles);

	return (
		<FormControl fullWidth>
			<InputLabel id={`font-label`}>{props.label}</InputLabel>
			<Select
				labelId={`font-label`}
				value={props.value?.url ?? ""}
				label={props.label}
				onChange={(event) => props.onChange(fontsFiles.find((file) => file.url === event.target.value))}
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
				{props.value ? props.value.name : props.helperText}
			</Typography>
		</FormControl>
	);
}
