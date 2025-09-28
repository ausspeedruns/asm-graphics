import { useEffect, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";

import { VolumeUp } from "@mui/icons-material";

const SIZE = 41;

const AudioIndicatorContainer = styled.div`
	overflow: hidden;
`;

const IconBGContainer = styled.div`
	height: ${SIZE}px;
	width: ${SIZE}px;
	background: var(--text-light);
	color: var(--text-dark);
	font-size: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

interface Props {
	side: "left" | "right" | "top";
	active?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

export const AudioIndicator: React.FC<Props> = (props: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (props.active) {
			gsap.to(containerRef.current, { x: 0, y: 0, duration: 1 });
		} else if (props.side === "right") {
			gsap.to(containerRef.current, { x: -SIZE, duration: 1 });
		} else if (props.side === "left") {
			gsap.to(containerRef.current, { x: SIZE, duration: 1 });
		} else if (props.side === "top") {
			gsap.to(containerRef.current, { y: SIZE, duration: 1 });
		}
	}, [props.active, props.side]);

	return (
		<AudioIndicatorContainer style={props.style} className={props.className}>
			<IconBGContainer ref={containerRef}>
				<VolumeUp style={{ fontSize: "inherit" }} />
			</IconBGContainer>
		</AudioIndicatorContainer>
	);
};
