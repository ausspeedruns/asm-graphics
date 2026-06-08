import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useNode } from "@craftjs/core";

import { useOverlayStore } from "../../../stores/overlay-store";
import { useEditorDevStore } from "../../../stores/editor-dev-store";
import NumberField from "../../../elements/number-field";
import { Box, Typography } from "@mui/material";

const AD_LENGTH_SECONDS = 5;

const SponsorsBoxContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 100%;
	height: 100%;
`;

const SponsorImage = styled.img`
	display: block;
	object-position: center;
	object-fit: contain;
	z-index: 3;
	height: 100%;
	width: 100%;
`;

interface FullBoxProps {
	style?: React.CSSProperties;
	className?: string;
	height?: number;
	width?: number;
	start?: number;
}

function getNextSponsorIndex(currentIndex: number, sponsorCount: number) {
	if (sponsorCount <= 1) {
		return 0;
	}

	return currentIndex + 1 >= sponsorCount ? 0 : currentIndex + 1;
}

export function Sponsors(props: FullBoxProps) {
	const devMode = useEditorDevStore((state) => state.devMode);
	const {
		connectors: { connect, drag },
	} = useNode();
	const sponsors = useOverlayStore((state) => state.sponsors);
	const [currentIndex, setCurrentIndex] = useState(props.start ?? 0);
	const sponsorContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!sponsors || sponsors.length === 0) {
			return;
		}

		setCurrentIndex(Math.min(props.start ?? 0, sponsors.length - 1));
	}, [props.start, sponsors]);

	useEffect(() => {
		if (!sponsors || sponsors.length < 2) {
			return;
		}

		const interval = setInterval(() => {
			const container = sponsorContainerRef.current;

			if (!container) {
				return;
			}

			const nextIndex = getNextSponsorIndex(currentIndex, sponsors.length);
			const timeline = gsap.timeline();

			timeline.to(container, { duration: 1, opacity: 0 });
			timeline.call(() => {
				setCurrentIndex((current) => getNextSponsorIndex(current, sponsors.length));
			});
			timeline.to(container, { duration: 1, opacity: 1 }, "+=0.5");
		}, AD_LENGTH_SECONDS * 1000);

		return () => clearInterval(interval);
	}, [sponsors]);

	if (!sponsors || sponsors.length === 0) {
		return null;
	}

	const sponsor = sponsors[currentIndex] ?? sponsors[0];

	if (!sponsor && !devMode) {
		return null;
	}

	const containerStyle = {
		...props.style,
		height: props.height,
		width: props.width,
	};

	return (
		<SponsorsBoxContainer
			className={props.className}
			style={containerStyle}
			ref={(ref) => {
				if (ref) {
					connect(drag(ref));
				}
			}}
		>
			{devMode ? (
				<div
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#0000ffaa",
						color: "white",
						fontSize: 24,
						textAlign: "center",
						padding: "0.5rem",
					}}
				>
					Sponsors Max Size
				</div>
			) : (
				sponsor && <SponsorImage src={sponsor.url} alt={sponsor.name} />
			)}
		</SponsorsBoxContainer>
	);
}

function SponsorsSettings() {
	const {
		actions: { setProp },
		height,
		width,
	} = useNode((node) => ({
		height: node.data.props["height"],
		width: node.data.props["width"],
	}));

	return (
		<div>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Typography variant="caption">Height</Typography>
				<NumberField value={height} onValueChange={(value) => setProp((props) => (props.height = value))} />
			</Box>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Typography variant="caption">Width</Typography>
				<NumberField value={width} onValueChange={(value) => setProp((props) => (props.width = value))} />
			</Box>
		</div>
	);
}


Sponsors.craft = {
	displayName: "Sponsors",
	props: {
		height: 90,
		width: 320,
	},
	related: {
		settings: SponsorsSettings,
	}
};
