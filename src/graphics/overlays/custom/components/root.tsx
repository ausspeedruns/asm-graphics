import { useNode } from "@craftjs/core";

interface RootProps {
	children?: React.ReactNode;
}

export function Root(props: RootProps) {
	const {
		connectors: { connect, drag },
	} = useNode();

	return (
		<div
			style={{
				position: "relative",
				width: 1920,
				height: 1016,
				minWidth: 1920,
				minHeight: 1016,
				display: "flex",
				outline: "1px solid #777",
				overflow: "hidden",
			}}
			ref={(ref) => {
				if (ref) {
					connect(drag(ref));
				}
			}}
		>
			{props.children}
		</div>
	);
}

Root.craft = {
	displayName: "Root",
	props: {},
};
