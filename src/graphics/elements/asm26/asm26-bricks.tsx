import styles from "./asm26-bricks.module.css";
import { ASM26NightMode } from "./asm26-night-mode";

interface ASM26BricksProps {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	particlesId: string;
}

export function ASM26Bricks(props: ASM26BricksProps) {
	return (
		<div className={`${styles.container} ${props.className ?? ""}`} style={props.style}>
			<ASM26NightMode particlesId={props.particlesId} />
			{props.children}
		</div>
	);
}
