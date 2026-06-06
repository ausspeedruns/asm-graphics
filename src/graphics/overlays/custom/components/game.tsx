interface GameProps {
	aspectRatio: number;
}

export function Game(props: GameProps) {
	return (
		<div
			style={{
				aspectRatio: props.aspectRatio,
				backgroundColor: "#ff0000", // Testing background color
			}}
		>
			{/* This is where the game capture will go, it will be sized to fit the container while maintaining aspect ratio */}
		</div>
	);
}
