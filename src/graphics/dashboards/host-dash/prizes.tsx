import { Paper } from "@mui/material";
import type { Prize } from "@asm-graphics/types/Prizes";
import { useReplicant } from "@nodecg/react-hooks";
import styles from "./prizes.module.css";

interface Props {
	style?: React.CSSProperties;
}

export function PrizesHost(props: Props) {
	const [prizesRep] = useReplicant("prizes");

	return (
		<div className={styles.upcomingContainer} style={props.style}>
			{prizesRep?.map((prize) => (
				<Prize prize={prize} key={prize.id} />
			))}
			{!prizesRep || prizesRep.length === 0 ? <div>No prizes have been set up.</div> : null}
		</div>
	);
}

interface PrizeProps {
	prize: Prize;
}

function Prize(props: PrizeProps) {
	return (
		<Paper className={styles.singleRunContainer} elevation={2}>
			<div className={styles.prizeContainer}>
				<span className={styles.item}>
					{props.prize.quantity && `${props.prize.quantity}x - `} {props.prize.item} - {props.prize.subItem}
				</span>
			</div>
			<div className={styles.prizeContainer}>
				<span>
					{props.prize.requirement}
					{props.prize.requirementSubheading && ` - ${props.prize.requirementSubheading}`}
				</span>
			</div>
		</Paper>
	);
}
