import { VerticalInfo } from "./vertical-info";

interface RunInfoProps {
	type: "wide" | "vertical" | "compact";
	dividers?: boolean;
}

export function RunInfo(props: RunInfoProps) {
	switch (props.type) {
		case "wide":
			return <div>Wide Run Info</div>;
		case "vertical":
			return <VerticalInfo hideDividers={!props.dividers} />;
		case "compact":
			return <div>Compact Run Info</div>;
		default:
			return <div>Unknown Run Info type: {props.type}</div>;
	}
}
