import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Stream } from '../../types/Streams';

import { Button, ButtonGroup, SvgIcon } from '@material-ui/core';
import { Close } from '@material-ui/icons';

// @ts-ignore
import Widescreen from '../media/Widescreen.svg';
// @ts-ignore
import Left from '../media/Left.svg';
// @ts-ignore
import Right from '../media/Right.svg';

const StreamEl = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	margin: 4px 0;
`;

interface StreamSwitcherProps {
	currentStreams: Stream[];
}

export const StreamSwitcher: React.FC<StreamSwitcherProps> = (props: StreamSwitcherProps) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
	const [size, setSize] = useState('X');
	// const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		const index = props.currentStreams.findIndex((stream) => stream.channel === props.channel);
		if (index === -1 || props.currentStreams[index].state === 'hidden' || props.currentStreams[index].state === 'live') {
			setSize('X');
			// setDisabled(false);
		} else {
			// setDisabled(props.currentStreams[index].state === 'live'); // Disable if they are live so they can't be changed
			setSize(props.currentStreams[index].size[0].toUpperCase());
		}
	}, [props.channel, props.currentStreams]);

	function updateSize(size: 'left' | 'right' | 'whole') {
		const streamObj: Stream = { channel: props.channel, size: size, state: 'preview' };
		nodecg.sendMessage('newTwitchStream', streamObj);
	}

	const removeStream = () => {
		setSize('X');
		nodecg.sendMessage('removeTwitchStream', props.channel);
	};

	return (
		<StreamEl>
			<span>{props.displayName}</span>
			<ButtonGroup>
				<Button onClick={removeStream} variant={size === 'X' ? 'contained' : 'outlined'}>
					<Close />
				</Button>
				<Button
					variant={size === 'L' ? 'contained' : 'outlined'}
					onClick={() => {
						setSize('L');
						updateSize('left');
					}}>
					<SvgIcon viewBox="0 0 50 28" component={Left} />
				</Button>
				<Button
					variant={size === 'W' ? 'contained' : 'outlined'}
					onClick={() => {
						setSize('W');
						updateSize('whole');
					}}>
					<SvgIcon viewBox="0 0 50 28" component={Widescreen} />
				</Button>
				<Button
					variant={size === 'R' ? 'contained' : 'outlined'}
					onClick={() => {
						setSize('R');
						updateSize('right');
					}}>
					<SvgIcon viewBox="0 0 50 28" component={Right} />
				</Button>
			</ButtonGroup>
		</StreamEl>
	);
};
