import clsx from "clsx";
import styles from "./orange-stripe.module.css";

interface Props {
	side: "top" | "right" | "bottom" | "left";
	style?: React.CSSProperties;
	className?: string;
}

export const OrangeStripe: React.FC<Props> = (props: Props) => {
	const horizontal = props.side === "top" || props.side === "bottom";
	const containerClass = styles[props.side];
	const stripeOrientation = horizontal ? styles.horizontal : styles.vertical;
	const bigStripeClass = props.side === "top" ? styles.bigTop : props.side === "right" ? styles.bigRight : props.side === "bottom" ? styles.bigBottom : styles.bigLeft;
	return (
		<div className={clsx(styles.orangeStripeContainer, containerClass)} style={props.style}>
			<div className={clsx(styles.stripe, styles.smallStripe, stripeOrientation)} />
			<div className={clsx(styles.stripe, styles.bigStripe, stripeOrientation, bigStripeClass)} />
		</div>
	);
};
