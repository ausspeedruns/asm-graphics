import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { RunnerNames } from '../../types/ExtraRunData';

import { Nameplate } from './nameplate';

const FacecamContainer = styled.div`
	position: relative;
	height: 100%;
	width: 100%;
`;

const HostnameArea = styled.div`
	width: 100%;
	height: calc(100% - 35px);
	background: linear-gradient(180deg, #0c94de 0%, #085d8b 100%);
	color: #ffffff;
	font-family: Noto Sans;

	display: flex;
	flex-direction: column;
	//gap: 10px;
	align-items: center;
	justify-content: center;
	position: relative;
`;

const RunnerArea = styled.div`
	display: flex;
	width: 100%;
	position: absolute;
	bottom: 0;
`;

interface FacecamProps {
	name: RunnerNames[];
	hosts: string[];
	height?: number;
	width?: number;
	className?: string;
	style?: React.CSSProperties;
}

export const Facecam: React.FC<FacecamProps> = (props: FacecamProps) => {
	const hostBoxRef = useRef<HTMLDivElement>(null);
	const donateTextRef = useRef<HTMLSpanElement>(null);

	let allRunnerNames;
	if (Array.isArray(props.name)) {
		allRunnerNames = props.name.map((name) => {
			return (
				<Nameplate
					name={name.name}
					twitch={name.twitch}
					style={{
						width: `${100 / props.name.length}%`,
						fontWeight: props.hosts.length > 0 && props.hosts[0] !== ' ' ? 'bold' : 'normal',	// Only bold if more names are going to be shown
					}}
					key={name.id}
				/>
			);
		});
	} else {
		allRunnerNames = (
			<Nameplate name={props.name} style={{ fontWeight: props.hosts.length > 0 ? 'bold' : 'normal' }} />
		);
	}

	const hostNames = props.hosts.map((host, index) => {
		return <Nameplate name={host} key={index} style={{ margin: '5px 0' }} />;
	});

	let hostArea = <></>;
	if (props.hosts.length > 0) {
		if (props.hosts[0] === ' ') {
			hostArea = (
				<span ref={donateTextRef} style={{ fontSize: 30, textAlign: 'center' }}>
					Donate at
					<br />
					<b>DONATE.AUSSPEEDRUNS.COM</b>
				</span>
			);
		} else {
			hostArea = (
				<>
					<span style={{ fontSize: 30 }}>Hosts</span>
					{hostNames}
				</>
			);
		}
	}

	useEffect(() => {
		if (donateTextRef.current && hostBoxRef.current) {
			if (hostBoxRef.current.offsetWidth < donateTextRef.current.offsetWidth) {
				donateTextRef.current.style.fontSize = `${donateTextRef.current.offsetWidth / 20}px`; 
			}
			// console.log(`Label: ${donateTextRef.current.offsetWidth} | Host: ${hostBoxRef.current.offsetWidth}`);
		}
	}, [hostArea]);

	return (
		<FacecamContainer
			style={Object.assign(
				{
					height: props.height,
					width: props.width,
				},
				props.style,
			)}
			className={props.className}>
			<HostnameArea style={{ display: props.hosts.length > 0 ? '' : 'none' }} ref={hostBoxRef}>{hostArea}</HostnameArea>
			<RunnerArea>{allRunnerNames}</RunnerArea>
		</FacecamContainer>
	);
};
