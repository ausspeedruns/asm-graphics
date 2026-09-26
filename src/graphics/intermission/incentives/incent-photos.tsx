import { useImperativeHandle, useRef } from "react";

import type NodeCG from "nodecg/types";

import type { TickerItemHandles } from "../incentives";
import styles from "./incent-photos.module.css";

const NUMBER_OF_PHOTOS = 5;

interface IncentivePhotosProps {
	photos?: NodeCG.AssetFile[];
	ref: React.Ref<TickerItemHandles>;
}

export function Photos(props: IncentivePhotosProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const photosRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(props.ref, () => ({
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
		<div className={styles.photosContainer} ref={containerRef}>
			<div className={styles.eventPhotos} ref={photosRef}>
				{randomPhotos.map((photo, index) => (
					<img className={styles.eventPhoto} key={index} src={photo.url} />
				))}
			</div>
		</div>
	);
}
