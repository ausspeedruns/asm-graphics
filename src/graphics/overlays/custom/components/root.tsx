interface RootProps {
	children?: React.ReactNode;
}

export function Root(props: RootProps) {
	return (
		<div style={{ position: "absolute", width: 1920, height: 1080, display: "flex", outline: "1px solid black" }}>
			{props.children}
		</div>
	);
}
