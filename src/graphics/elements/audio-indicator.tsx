import { useEffect, useRef } from "react";
import gsap from "gsap";
import clsx from "clsx";

import { VolumeUp } from "@mui/icons-material";
import styles from "./audio-indicator.module.css";

const SIZE = 41;

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
		<div style={props.style} className={clsx(styles.container, props.className)}>
			<div className={styles.iconBackground} ref={containerRef}>
				<VolumeUp style={{ fontSize: "inherit" }} />
			</div>
		</div>
	);
};
