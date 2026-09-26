import clsx from "clsx";
import styles from "./title.module.css";

interface Props {
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

export function TickerTitle(props: Props) {
	return (
		<div className={clsx(styles.tickerTitleContainer, props.className)} style={props.style}>
			{props.children}
		</div>
	);
}
