import { useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import type NodeCG from "nodecg/types";

import { TickerItemHandles } from "./incentives";

const PhotosContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	transform: translate(-100%, 0);
	padding: 16px;
	box-sizing: border-box;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 20px;
`;

const EventPhotos = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const EventPhoto = styled.img`
	height: 380px;
	width: auto;
	object-fit: contain;
	margin: 0 -1px;
`;

const NUMBER_OF_PHOTOS = 5;

type IncentivePhotosProps = {
	photos?: NodeCG.AssetFile[];
};

export const Photos = React.forwardRef<TickerItemHandles, IncentivePhotosProps>((props, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const photosRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			tl.set(containerRef.current, { xPercent: 100 });
			tl.fromTo(photosRef.current, { xPercent: -210 }, { xPercent: 210, duration: 30, ease: "none" });
			return tl;
		},
	}));

	const getRandomPhotos = () => {
		const randomPhotos: NodeCG.AssetFile[] = [];
		if (props.photos && props.photos.length > NUMBER_OF_PHOTOS) {
			const shuffledPhotos = [...props.photos].sort(() => Math.random() - 0.5);
			randomPhotos.push(...shuffledPhotos.slice(0, NUMBER_OF_PHOTOS));
		}
		return randomPhotos;
	};

	const randomPhotos = getRandomPhotos();

	return (
		<PhotosContainer ref={containerRef}>
			<EventPhotos ref={photosRef}>
				{randomPhotos.map((photo, index) => (
					<EventPhoto key={index} src={photo.url} />
				))}
			</EventPhotos>
		</PhotosContainer>
	);
});

Photos.displayName = "Socials";
