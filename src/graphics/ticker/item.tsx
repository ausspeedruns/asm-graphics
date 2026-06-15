import styled from "@emotion/styled";

const TickerItemContainer = styled.div`
	height: 64px;
	width: fit-content;
	font-family: var(--main-font);
	color: var(--text-light);
	display: flex;
	align-items: center;
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	margin: 0 12px;
	height: 100%;
`;

const Title = styled.span`
	font-size: 28px;
	white-space: nowrap;
	font-weight: bold;
	font-family: var(--secondary-font);
`;

const Subtitle = styled.span`
	font-size: 17px;
	white-space: nowrap;
`;

const BorderItem = styled.div`
	height: 55px;
	width: 2px;
	background: var(--accent);
`;

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
		<TickerItemContainer>
			<VerticalStack>
				<Title>{props.title}</Title>
				<Subtitle>{props.sub}</Subtitle>
			</VerticalStack>
			<BorderItem />
		</TickerItemContainer>
	);
};
