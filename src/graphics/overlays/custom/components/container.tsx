import { useNode } from "@craftjs/core";
import { useEditorDevStore } from "../../../stores/editor-dev-store";
import {
	Box,
	Typography,
	ToggleButton,
	ToggleButtonGroup,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import NumberField from "../../../elements/number-field";
import type { Props } from "@dnd-kit/core/dist/components/DragOverlay";
import { ViewColumn, TableRows } from "@mui/icons-material";
import { useOverlayStore } from "../../../stores/overlay-store";

interface ContainerProps {
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

export function Container(props: ContainerProps) {
	const devMode = useEditorDevStore((state) => state.devMode);
	const {
		connectors: { connect, drag },
	} = useNode();

	const { style, children } = props;
	const containerStyle: React.CSSProperties = {
		display: "flex",
		backgroundColor: devMode ? "#000000aa" : undefined,
		backgroundSize: "cover",
		backgroundPosition: "center",
		...style,
	};

	return (
		<div
			style={containerStyle}
			ref={(ref) => {
				if (ref) {
					connect(drag(ref));
				}
			}}
		>
			{children}
		</div>
	);
}

function ContainerSettings() {
	const {
		actions: { setProp },
		direction,
		flexGrow,
		justifyContent,
		alignItems,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		backgroundImage,
	} = useNode((node) => ({
		direction: node.data.props["style"]?.flexDirection === "row" ? "horizontal" : "vertical",
		flexGrow: node.data.props["style"]?.flexGrow ?? 1,
		justifyContent: node.data.props["style"]?.justifyContent ?? "flex-start",
		alignItems: node.data.props["style"]?.alignItems ?? "stretch",
		paddingTop: node.data.props["style"]?.paddingTop ?? 0,
		paddingRight: node.data.props["style"]?.paddingRight ?? 0,
		paddingBottom: node.data.props["style"]?.paddingBottom ?? 0,
		paddingLeft: node.data.props["style"]?.paddingLeft ?? 0,
		backgroundImage: node.data.props["style"]?.backgroundImage,
	}));

	const backgrounds = useOverlayStore((state) => state.backgrounds);

	return (
		<>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">Direction</Typography>
				<ToggleButtonGroup
					value={direction}
					onChange={(_e, value) => {
						if (!value) {
							return;
						}

						setProp(
							(props: Props) =>
								(props.style = {
									...props.style,
									flexDirection: value === "horizontal" ? "row" : "column",
								}),
						);
					}}
					exclusive
					size="small"
				>
					<ToggleButton value="horizontal">
						<ViewColumn fontSize="small" />
					</ToggleButton>
					<ToggleButton value="vertical">
						<TableRows fontSize="small" />
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">Flex Grow</Typography>

				<NumberField
					size="small"
					value={flexGrow}
					onValueChange={(value) => setProp((props) => (props.style = { ...props.style, flexGrow: value }))}
				/>
			</Box>
			<FormControl fullWidth>
				<InputLabel id="justify-content-label">Justify Content</InputLabel>
				<Select
					labelId="justify-content-label"
					id="justify-content-select"
					value={justifyContent}
					label="Justify Content"
					onChange={(event) =>
						setProp((props) => (props.style = { ...props.style, justifyContent: event.target.value }))
					}
				>
					<MenuItem value="flex-start">Flex Start</MenuItem>
					<MenuItem value="center">Center</MenuItem>
					<MenuItem value="flex-end">Flex End</MenuItem>
					<MenuItem value="space-between">Space Between</MenuItem>
					<MenuItem value="space-around">Space Around</MenuItem>
					<MenuItem value="space-evenly">Space Evenly</MenuItem>
				</Select>
			</FormControl>
			<FormControl fullWidth sx={{ mt: 2 }}>
				<InputLabel id="align-items-label">Align Items</InputLabel>
				<Select
					labelId="align-items-label"
					id="align-items-select"
					value={alignItems}
					label="Align Items"
					onChange={(event) =>
						setProp((props) => (props.style = { ...props.style, alignItems: event.target.value }))
					}
				>
					<MenuItem value="stretch">Stretch</MenuItem>
					<MenuItem value="flex-start">Flex Start</MenuItem>
					<MenuItem value="center">Center</MenuItem>
					<MenuItem value="flex-end">Flex End</MenuItem>
				</Select>
			</FormControl>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">Padding Top</Typography>

				<NumberField
					size="small"
					value={paddingTop}
					onValueChange={(value) => setProp((props) => (props.style = { ...props.style, paddingTop: value }))}
				/>
			</Box>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">Padding Right</Typography>

				<NumberField
					size="small"
					value={paddingRight}
					onValueChange={(value) =>
						setProp((props) => (props.style = { ...props.style, paddingRight: value }))
					}
				/>
			</Box>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">Padding Bottom</Typography>

				<NumberField
					size="small"
					value={paddingBottom}
					onValueChange={(value) =>
						setProp((props) => (props.style = { ...props.style, paddingBottom: value }))
					}
				/>
			</Box>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">Padding Left</Typography>

				<NumberField
					size="small"
					value={paddingLeft}
					onValueChange={(value) =>
						setProp((props) => (props.style = { ...props.style, paddingLeft: value }))
					}
				/>
			</Box>
			<FormControl fullWidth sx={{ mt: 2 }}>
				<InputLabel id="backgrounds-label">Backgrounds</InputLabel>
				<Select
					labelId="backgrounds-label"
					id="backgrounds-select"
					value={backgroundImage}
					label="Backgrounds"
					onChange={(event) =>
						setProp((props) => (props.style = { ...props.style, backgroundImage: event.target.value }))
					}
				>
					{backgrounds.map((background) => (
						<MenuItem key={background.name} value={`url(${background.url})`}>
							{background.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</>
	);
}

Container.craft = {
	displayName: "Container",
	props: {
		style: {
			flexDirection: "column",
			flexGrow: 1,
			justifyContent: "flex-start",
			alignItems: "stretch",
			backgroundImage: undefined,
		},
	},
	related: {
		settings: ContainerSettings,
	},
};
