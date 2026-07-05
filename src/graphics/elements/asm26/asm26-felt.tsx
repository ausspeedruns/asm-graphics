import styles from "./asm26-felt.module.css";
import { ASM26NightMode } from "./asm26-night-mode";
import clsx from "clsx";

interface ASM26FeltProps {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	particlesId: string;
	disableNightMode?: boolean;
}

export function ASM26Felt(props: ASM26FeltProps) {
	return (
		<div
			className={clsx(styles.container, props.className, "asm26-felt")}
			style={props.style}
		>
			<div className={clsx(styles.stitching, "asm26-stitching")} />
			{!props.disableNightMode && <ASM26NightMode particlesId={props.particlesId} />}
			{props.children}
		</div>
	);
}
