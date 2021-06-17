import React from 'react';
import styled from 'styled-components';

const ASMBannerContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	font-style: italic;
	font-size: 18px;
	margin-bottom: 8px;
`;

const LineBorder = styled.div`
	height: 4px;
	flex-grow: 1;
	background: var(--asm-orange);
`;

const ASMLogo = styled.img`
	height: 22px;
	width: auto;
	margin: 0 8px;
`;

interface ASMBannerProps {
	style?: React.CSSProperties;
	className?: string;
}

export const ASMBanner: React.FC<ASMBannerProps> = (props) => {
	return (
		<ASMBannerContainer className={props.className} style={props.style}>
			<LineBorder />
			<ASMLogo src="../shared/design/ASM21-BannerLogo.svg" />
			<LineBorder />
		</ASMBannerContainer>
	);
};
