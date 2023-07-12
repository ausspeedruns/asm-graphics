// From jr-layouts by Hoishin https://github.com/JapaneseRestream/jr-layouts
// Slightly modified by Ewan Lyon

import React, { useRef, useEffect } from 'react';

import styled from 'styled-components';

export const Text = styled.div`
	white-space: nowrap;
	text-align: center;
`;

const renderTextWithLineBreaks = (text: string) => {
	const lines = text.split('\\n');
	return lines.map((line, index) => (
		<React.Fragment key={index}>
			{line}
			{index !== lines.length - 1 && <br />}
		</React.Fragment>
	));
};

interface Props {
	text: string;
	style?: React.CSSProperties;
	className?: string;
	allowNewlines?: boolean;
	alignment?: 'centre' | 'left' | 'right';
}

export const FitText: React.FunctionComponent<Props> = React.memo((props: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		const text = textRef.current;

		if (!container || !text) {
			return;
		}

		const MAX_WIDTH = container.clientWidth;
		const currentWidth = text.clientWidth;
		const scaleX = currentWidth > MAX_WIDTH ? MAX_WIDTH / currentWidth : 1;
		const newTransform = `scaleX(${scaleX})`;

		text.style.transform = newTransform;
	});

	let justifyContent = 'center';
	let transformOrigin = 'center';
	switch (props.alignment) {
		case 'left':
			justifyContent = 'left';
			transformOrigin = 'left';
			break;
		case 'right':
			justifyContent = 'right';
			transformOrigin = 'right';
			break;
		case 'centre':
		default:
			break;
	}

	return (
		<div
			className={props.className}
			style={{ display: 'flex', justifyContent: justifyContent, ...props.style }}
			ref={containerRef}>
			<Text ref={textRef} style={{ transformOrigin: transformOrigin }}>
				{props.allowNewlines ? renderTextWithLineBreaks(props.text) : props.text.replaceAll('\\n', ' ')}
			</Text>
		</div>
	);
});

FitText.displayName = 'FitText';
