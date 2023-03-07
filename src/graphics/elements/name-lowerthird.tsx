import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useListenFor } from 'use-nodecg';
import gsap from 'gsap';
import AusSpeedrunsLogo from '../media/AusSpeedruns-Icon.svg';

const NameLowerThirdContainer = styled.div`
	display: flex;
`;

const LogoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background: #ffffff;
	overflow: hidden;
	width: 0;
`;

const Logo = styled.img`
	height: 90px;
	width: 90px;
	object-fit: contain;
	padding: 12px;
`;

const TextContainer = styled.div`
	background: var(--orange-500);
	color: #ffffff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 12px 0;
	overflow: hidden;
	box-sizing: border-box;
	width: 0;
`;

const Name = styled.div`
	font-family: Russo One;
	font-size: 42px;
	line-height: 42px;
	white-space: nowrap;
	padding: 0 12px;
`;

const Subtitle = styled.div`
	font-family: Noto Sans;
	font-size: 34px;
	line-height: 34px;
	white-space: nowrap;
	padding: 0 12px;
`;

interface Props {
	name: string;
	subtitle: string;
	className?: string;
	style?: React.CSSProperties;
}

export const NameLowerThird = (props: Props) => {
	const LogoRef = useRef(null);
	const TextRef = useRef(null);
	const [tl] = useState(gsap.timeline);

	useListenFor('show-lowerthird', () => {
		tl.clear();
		tl.set([LogoRef.current, TextRef.current], { width: 0 });
		tl.to([LogoRef.current, TextRef.current], { width: 'auto', duration: 1 });
		tl.play();
	});

	useListenFor('hide-lowerthird', () => {
		tl.clear();
		tl.to([LogoRef.current, TextRef.current], { width: 0, duration: 1 });
		// tl.set([LogoRef.current, TextRef.current], { width: 0 });
		tl.play();
	});

	return (
		<NameLowerThirdContainer className={props.className} style={props.style}>
			<LogoContainer ref={LogoRef}>
				<Logo src={AusSpeedrunsLogo} />
			</LogoContainer>
			<TextContainer ref={TextRef}>
				<Name>{props.name}</Name>
				<Subtitle>{props.subtitle}</Subtitle>
			</TextContainer>
		</NameLowerThirdContainer>
	);
};
