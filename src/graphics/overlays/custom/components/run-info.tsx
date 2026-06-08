import { useNode } from "@craftjs/core";
import { VerticalInfo } from "./run-info/vertical-info";
import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import type NodeCG from "nodecg/types";
import { FontSetting } from "../settings/font";
import { useDynamicFont } from "../../../elements/useDynamicFont";

interface RunInfoProps {
	type: "wide" | "vertical" | "compact";
	dividers?: boolean;
	gameFont?: NodeCG.AssetFile;
	categoryFont?: NodeCG.AssetFile;
	metadataFont?: NodeCG.AssetFile;
}

export function RunInfo(props: RunInfoProps) {
	const { loadFont } = useDynamicFont();
	const {
		connectors: { connect, drag },
	} = useNode();

	let content: React.ReactNode;

	switch (props.type) {
		case "wide":
			content = <div>Wide Run Info</div>;
			break;
		case "vertical":
			content = <VerticalInfo hideDividers={!props.dividers} />;
			break;
		case "compact":
			content = <div>Compact Run Info</div>;
			break;
		default:
			content = <div>Unknown Run Info type: {props.type}</div>;
			break;
	}

	return (
		<div
			ref={(ref) => {
				if (ref) {
					connect(drag(ref));
				}
			}}
			style={
				{
					"--game-font": props.gameFont ? `url(${props.gameFont.url})` : undefined,
					"--category-font": props.categoryFont ? `url(${props.categoryFont.url})` : undefined,
					"--metadata-font": props.metadataFont ? `url(${props.metadataFont.url})` : undefined,
				} as React.CSSProperties
			}
		>
			{content}
		</div>
	);
}

function RunInfoSettings() {
	const {
		props: { type, dividers, gameFont, categoryFont, metadataFont },
		setProp,
	} = useNode((node) => ({
		props: node.data.props,
	}));

	return (
		<>
			<FormControl fullWidth>
				<InputLabel id="type-label">Type</InputLabel>
				<Select
					labelId="type-label"
					id="type-select"
					value={type}
					label="Type"
					onChange={(event) => setProp((props) => (props["type"] = event.target.value))}
				>
					<MenuItem value="wide">Wide</MenuItem>
					<MenuItem value="vertical">Vertical</MenuItem>
					<MenuItem value="compact">Compact</MenuItem>
				</Select>
			</FormControl>
			<FormControlLabel
				control={
					<Switch
						checked={dividers}
						onChange={(event) => setProp((props) => (props["dividers"] = event.target.checked))}
					/>
				}
				label="Dividers"
				labelPlacement="start"
			/>
			<FontSetting
				value={gameFont}
				label="Game Font"
				helperText="Select a font for the game name"
				onChange={(file) => setProp((props) => (props["gameFont"] = file))}
			/>
			<FontSetting
				value={categoryFont}
				label="Category Font"
				helperText="Select a font for the category name"
				onChange={(file) => setProp((props) => (props["categoryFont"] = file))}
			/>
			<FontSetting
				value={metadataFont}
				label="Metadata Font"
				helperText="Select a font for the metadata"
				onChange={(file) => setProp((props) => (props["metadataFont"] = file))}
			/>
		</>
	);
}

RunInfo.craft = {
	displayName: "RunInfo",
	props: {
		type: "vertical",
		dividers: true,
		gameFont: undefined,
		categoryFont: undefined,
		metadataFont: undefined,
	},
	related: {
		settings: RunInfoSettings,
	},
};
