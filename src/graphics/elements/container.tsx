import clsx from "clsx";
import styles from "./container.module.css";

interface ContainerProps {
	style?: React.CSSProperties;
	children?: React.ReactNode;
	className?: string;
	ref?: React.Ref<HTMLDivElement>;
}

export function Container(props: ContainerProps) {
	return (
		<div style={props.style} ref={props.ref} className={clsx(styles.container, props.className)}>
			{props.children}
		</div>
	);
}
