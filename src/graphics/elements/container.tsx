import clsx from "clsx";
import styles from "./container.module.css";

interface ContainerProps {
	style?: React.CSSProperties;
	children?: React.ReactNode;
	className?: string;
	ref?: React.Ref<HTMLDivElement>;

	asap26NoBorder?: boolean;
}

export function Container(props: ContainerProps) {
	return (
		<div style={props.style} ref={props.ref} className={clsx(styles.container, props.className, props.asap26NoBorder && styles.asap26NoBorder)}>
			{props.children}
		</div>
	);
}
