import styles from "./header.module.css";

interface Props {
	text: string;
	style?: React.CSSProperties;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	children?: React.ReactNode;
	draggable?: boolean;
}

export function Header(props: Props) {
	return (
		<div className={styles.headerContainer} style={props.style} onClick={props.onClick} draggable={props.draggable}>
			<h3>{props.text}</h3>
		</div>
	);
}
