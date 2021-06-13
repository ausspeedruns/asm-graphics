import React from 'react';
import styled from 'styled-components';

const OrangeStripeContainer = styled.div`
	display: flex;
`;

const BigStripe = styled.div`
	background: var(--asm-orange);

	height: ${(props: Props) =>
		props.side === 'top' || props.side === 'bottom' ? '20px' : '100%'};
	width: ${(props: Props) =>
		props.side === 'top' || props.side === 'bottom' ? '100%' : '20px'};
`;

const SmallStripe = styled(BigStripe)`
	background: var(--asm-orange);
	height: ${(props: Props) =>
		props.side === 'top' || props.side === 'bottom' ? '4px' : '100%'};
	width: ${(props: Props) =>
		props.side === 'top' || props.side === 'bottom' ? '100%' : '4px'};
`;

interface Props {
	side: 'top' | 'right' | 'bottom' | 'left';
	style?: React.CSSProperties;
	className?: string;
}

export const OrangeStripe: React.FC<Props> = (props: Props) => {
	let flexDirection = 'row';
	let bigStripeStyle: React.CSSProperties = {};
	switch (props.side) {
		case 'top':
			flexDirection = 'column-reverse';
			bigStripeStyle = {marginBottom: 8}
			break;
		case 'right':
			flexDirection = 'row';
			bigStripeStyle = {marginLeft: 8}
			break;
		case 'bottom':
			flexDirection = 'column';
			bigStripeStyle = {marginTop: 8}
			break;
		case 'left':
			flexDirection = 'row-reverse';
			bigStripeStyle = {marginRight: 8}
			break;
		default:
			flexDirection = 'row';
			bigStripeStyle = {marginTop: 8}
			break;
	}
	return (
		<OrangeStripeContainer style={Object.assign(props.style, {flexDirection: flexDirection as any})}>
			<SmallStripe side={props.side} />
			<BigStripe style={bigStripeStyle} side={props.side} />
		</OrangeStripeContainer>
	);
};
