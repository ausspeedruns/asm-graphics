interface ContainerProps {
	direction?: "horizontal" | "vertical";
	flexGrow?: number;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

export function Container(props: ContainerProps) {
	const { direction, flexGrow, style, children } = props;
	const containerStyle: React.CSSProperties = {
		display: "flex",
		flexDirection: direction === "horizontal" ? "row" : "column",
		flexGrow: flexGrow ?? 1,
		backgroundColor: "#000000aa",
		...style,
	};

	return <div style={containerStyle}>{children}</div>;
}
