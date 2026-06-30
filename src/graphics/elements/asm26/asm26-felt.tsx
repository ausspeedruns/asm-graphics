import styles from "./asm26-felt.module.css";
import { ASM26NightMode } from "./asm26-night-mode";

interface ASM26FeltProps {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	particlesId: string;
}

export function ASM26Felt(props: ASM26FeltProps) {
	return (
		<div className={`${styles.container} ${props.className ?? ""}`} style={props.style}>
			<div className={styles.stitching} />
			<ASM26NightMode particlesId={props.particlesId} />
			{props.children}
		</div>
	);
}
