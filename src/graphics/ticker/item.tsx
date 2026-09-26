import styles from "./item.module.css";

interface Props {
	title: string;
	sub: string;
	index?: number;
}

// export function tgxColour(index = -1, redStart = false) {
// 	let modulo = index % 4;
// 	if (!redStart) modulo++;

// 	switch (modulo) {
// 		case 0:
// 			return 'var(--tgx-red)';
// 		case 1:
// 			return 'var(--tgx-yellow)';
// 		case 2:
// 			return 'var(--tgx-blue)';
// 		case 3:
// 			return 'var(--tgx-green)';
// 		case 4:
// 			return 'var(--tgx-red)';
// 		default:
// 			return undefined;
// 	}
// }

export const TickerItem: React.FC<Props> = (props: Props) => {
	return (
		<div className={styles.tickerItemContainer}>
			<div className={styles.verticalStack}>
				<span className={styles.title}>{props.title}</span>
				<span className={styles.subtitle}>{props.sub}</span>
			</div>
			<div className={styles.borderItem} />
		</div>
	);
};
