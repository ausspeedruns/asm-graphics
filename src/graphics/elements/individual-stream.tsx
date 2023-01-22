import React from 'react';



const PARENTS = nodecg.bundleConfig.twitch.parents;

interface ASMStreamProps {
	channel: string;
	muted?: boolean;
	size: 'left' | 'right' | 'whole';
	className?: string;
	style?: React.CSSProperties;
}

export const ASMStream: React.FC<ASMStreamProps> = (props: ASMStreamProps) => {
	// 1016px is the max height of a stream graphic because of the omnibar
	let clipPath;
	switch (props.size) {
		case 'whole':
			clipPath = 'polygon(0 0, 100% 0, 100% 1016px, 0 1016px)';
			break;
		case 'left':
			clipPath = 'polygon(0 0, 50% 0, 50% 1016px, 0% 1016px)';
			break;
		case 'right':
			clipPath = 'polygon(50% 0, 100% 0, 100% 1016px, 50% 1016px)';
			break;
		default:
			clipPath = 'polygon(0 0, 100% 0, 100% 1016px, 0 1016px)';
			break;
	}

	const parents = PARENTS.map((parent) => {
		return `&parent=${parent}`;
	}).join('');

	return (
		<div className={props.className} style={props.style}>
			<iframe
				src={`https://player.twitch.tv/?channel=${props.channel}${parents}&muted=${props.muted}&controls=false`}
				height={1080}
				width={1920}
				style={{ clipPath: clipPath }}
				frameBorder={0}
				scrolling="no"></iframe>
		</div>
	);
};
