import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Stream } from "@asm-graphics/types/Streams";

// import { Button, ButtonGroup, SvgIcon } from '@mui/material';
import { Close } from "@mui/icons-material";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

// @ts-ignore
import Widescreen from "../media/Widescreen.svg";
// @ts-ignore
import Left from "../media/Left.svg";
// @ts-ignore
import Right from "../media/Right.svg";

const StreamEl = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	margin: 4px 0;
`;

const StreamIcon = styled.img`
	/* height: 40px;
	width: auto; */
`;

interface StreamSwitcherProps {
	currentStreams: Stream[];
}

export const StreamSwitcher: React.FC<StreamSwitcherProps> = (props: StreamSwitcherProps) => {
	return (
		<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
			<StreamSizeSelection currentStreams={props.currentStreams} channel="asm_station1" displayName="ASM 1" />
			<StreamSizeSelection currentStreams={props.currentStreams} channel="asm_station2" displayName="ASM 2" />
			<StreamSizeSelection currentStreams={props.currentStreams} channel="asm_station3" displayName="ASM 3" />
			<StreamSizeSelection currentStreams={props.currentStreams} channel="asm_station4" displayName="ASM 4" />
		</div>
	);
};

interface SizeSelection {
	channel: string;
	displayName: string;
	currentStreams: Stream[];
}

const StreamSizeSelection: React.FC<SizeSelection> = (props: SizeSelection) => {
	const [size, setSize] = useState("X");
	// const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		const index = props.currentStreams.findIndex((stream) => stream.channel === props.channel);
		if (
			index === -1 ||
			props.currentStreams[index].state === "hidden" ||
			props.currentStreams[index].state === "live"
		) {
			setSize("X");
			// setDisabled(false);
		} else {
			// setDisabled(props.currentStreams[index].state === 'live'); // Disable if they are live so they can't be changed
			setSize(props.currentStreams[index].size);
		}
	}, [props.channel, props.currentStreams]);

	function updateSize(size: "left" | "right" | "whole" | "X") {
		if (size === "X") {
			nodecg.sendMessage("removeTwitchStream", props.channel);
			return;
		}

		const streamObj: Stream = { channel: props.channel, size: size, state: "preview" };
		nodecg.sendMessage("newTwitchStream", streamObj);
	}

	const handleChange = (_e: React.MouseEvent<HTMLElement, MouseEvent>, v: any) => {
		if (v.length) {
			updateSize(v);
		}
	};

	return (
		<StreamEl>
			<span>{props.displayName}</span>

			<ToggleButtonGroup size="small" value={size} exclusive onChange={handleChange}>
				<ToggleButton size="small" value="X">
					<Close />
				</ToggleButton>
				<ToggleButton size="small" value="left">
					<StreamIcon src={Left} />
				</ToggleButton>
				<ToggleButton size="small" value="whole">
					<StreamIcon src={Widescreen} />
				</ToggleButton>
				<ToggleButton size="small" value="right">
					<StreamIcon src={Right} />
				</ToggleButton>
			</ToggleButtonGroup>
		</StreamEl>
	);
};
