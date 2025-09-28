import styled from "styled-components";

const OrangeStripeContainer = styled.div`
	display: flex;
`;

const BigStripe = styled.div<Props>`
	background: var(--asm-orange);

	height: ${({ side }) => (side === "top" || side === "bottom" ? "20px" : "100%")};
	width: ${({ side }) => (side === "top" || side === "bottom" ? "100%" : "20px")};
`;

const SmallStripe = styled(BigStripe)<Props>`
	background: var(--asm-orange);
	height: ${({ side }) => (side === "top" || side === "bottom" ? "4px" : "100%")};
	width: ${({ side }) => (side === "top" || side === "bottom" ? "100%" : "4px")};
`;

interface Props {
	side: "top" | "right" | "bottom" | "left";
	style?: React.CSSProperties;
	className?: string;
}

export const OrangeStripe: React.FC<Props> = (props: Props) => {
	let flexDirection: React.CSSProperties = {};
	let bigStripeStyle: React.CSSProperties = {};
	switch (props.side) {
		case "top":
			flexDirection = { flexDirection: "column-reverse", width: "100%" };
			bigStripeStyle = { marginBottom: 8 };
			break;
		case "right":
			flexDirection = { flexDirection: "row", height: "100%" };
			bigStripeStyle = { marginLeft: 8 };
			break;
		case "bottom":
			flexDirection = { flexDirection: "column", width: "100%" };
			bigStripeStyle = { marginTop: 8 };
			break;
		case "left":
			flexDirection = { flexDirection: "row-reverse", height: "100%" };
			bigStripeStyle = { marginRight: 8 };
			break;
		default:
			flexDirection = { flexDirection: "row" };
			bigStripeStyle = { marginTop: 8 };
			break;
	}
	return (
		<OrangeStripeContainer style={Object.assign(props.style || {}, flexDirection)}>
			<SmallStripe side={props.side} />
			<BigStripe style={bigStripeStyle} side={props.side} />
		</OrangeStripeContainer>
	);
};
