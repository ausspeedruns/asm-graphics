import { useReplicant } from "@nodecg/react-hooks";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";

interface CurrentRunInfoProps {
	style?: React.CSSProperties;
}

export function CurrentRunInfo(props: CurrentRunInfoProps) {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });

	return (
		<div style={{ display: "flex", flexDirection: "column", ...props.style }}>
			<span style={{ fontWeight: "bold" }}>{runDataActiveRep?.game}</span>
			<span>{runDataActiveRep?.category}</span>
			<span>Est: {runDataActiveRep?.estimate}</span>
		</div>
	);
}
