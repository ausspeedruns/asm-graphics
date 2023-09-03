import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Button, Input, Slider } from "@mui/material";
import lightBlue from "@mui/material/colors/lightBlue";
import { VolumeUp, VolumeOff } from "@mui/icons-material";

interface DisabledProps {
	readonly disabled?: boolean;
}

const StreamAudioContainer = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	flex-grow: 1;
	border: 1px solid ${(props: DisabledProps) => (props.disabled ? "rgb(255 255 255 / 12%)" : lightBlue[500])};
	border-radius: 20px;
	margin: 8px 4px;
	padding: 8px;
`;

const SourceLabel = styled.span`
	font-weight: bold;
	color: ${(props: DisabledProps) => (props.disabled ? "rgba(255, 255, 255, 0.3)" : "#ffffff")};
`;

const VolumeMarks = [
	{
		value: 100,
		label: "100%",
	},
	{
		value: 75,
	},
	{
		value: 50,
		label: "50%",
	},
	{
		value: 25,
	},
	{
		value: 0,
		label: "0%",
	},
];

interface StreamAudioProps {
	source: string;
	disabled?: boolean;
}

export const StreamAudio: React.FC<StreamAudioProps> = (props: StreamAudioProps) => {
	const [mute, setMute] = useState(false);
	const [volumeNum, setVolumeNum] = useState(100);

	const muteHandler = () => {
		setMute(!mute);
		nodecg.sendMessage("muteSourceAudio", {
			source: props.source,
			mute: !mute,
		});
	};

	const volumeHandler = (_event: any, newValue: number | number[]) => {
		if (typeof newValue === "number") {
			setVolumeNum(newValue);
		}
	};

	useEffect(() => {
		if (typeof volumeNum === "number") {
			nodecg.sendMessage("changeSourceAudio", {
				source: props.source,
				volume: volumeNum,
			});
		}
	}, [volumeNum]);

	return (
		<StreamAudioContainer disabled={props.disabled}>
			<SourceLabel disabled={props.disabled}>{props.source}</SourceLabel>
			<Button
				disabled={props.disabled}
				onClick={muteHandler}
				variant="outlined"
				style={{ margin: "4px 0 12px 0" }}
			>
				{mute || props.disabled ? <VolumeOff /> : <VolumeUp />}
			</Button>
			{/* <Button
				onClick={() => {
					setDisabled(!disabled);
				}}>
				Dev disable
			</Button> */}

			<Slider
				defaultValue={100}
				onChange={volumeHandler}
				disabled={props.disabled}
				orientation="vertical"
				step={1}
				min={0}
				max={100}
				marks={VolumeMarks}
				valueLabelDisplay="auto"
			/>
			<Input
				value={volumeNum}
				margin="dense"
				onChange={(e) => setVolumeNum(parseInt(e.target.value || "100", 10))}
				inputProps={{
					step: 1,
					min: 0,
					max: 1995,
					type: "number",
				}}
			/>
		</StreamAudioContainer>
	);
};
