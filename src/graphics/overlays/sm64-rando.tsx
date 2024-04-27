import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { WideInfo } from "../elements/info-box/wide";
import { Facecam } from "../elements/facecam";

import WidescreenTop from "../elements/event-specific/dh-24/Widescreen-2.png";
import { useReplicant } from "@nodecg/react-hooks";
import { SM64MovementAbilities } from "extensions/sm64-rando";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const TopBar = styled.div`
	height: 140px;
	width: 100%;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	background-color: var(--main);
	position: relative;
	/* border-bottom: 1px solid var(--sec); */
`;

const Sidebar = styled.div`
	position: absolute;
	top: 140px;
	height: 876px;
	width: 757px;
	border-right: 1px solid var(--dh-red);
	z-index: -1;
	overflow: hidden;
`;

const SidebarBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 454px;
	position: relative;
	/* border-top: 1px solid var(--sec); */
	overflow: hidden;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
`;

const RandomiserContainer = styled.div`
	background: var(--dh-orange-to-red);
	color: white;
	width: 100%;
	height: 100%;
	text-transform: uppercase;
`;

const RandomiserHeader = styled.div`
	font-family: var(--secondary-font);
	font-weight: bold;
	font-size: 30px;
	text-align: center;
`;

const AbilityGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 8px;

	font-family: var(--main-font);
	font-size: 42px;
`;

const ItemsRow = styled.div`
	display: flex;
	height: 54px;
	align-items: center;
	padding-right: 8px;
`;

const ItemHeader = styled.div`
	font-family: var(--secondary-font);
	font-weight: bold;
	font-size: 26px;
	text-align: center;
	margin-left: 18px;
	margin-right: 12px;
	margin-bottom: -3px;
`;

const Items = styled.div`
	background: black;
	display: flex;
	flex-grow: 1;
	justify-content: space-evenly;
	height: 42px;
	margin-bottom: -3px;
`;

const Item = styled.div<{ $active?: boolean }>`
	font-family: var(--main-font);
	font-size: 26px;
	color: ${(props) => (props.$active ? "#fff" : "rgba(255, 255, 255, 0.5)")};
	transition-duration: 1s;
`;

export const SM64MovementRando = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const [randomiserRep] = useReplicant<SM64MovementAbilities>("rando:sm64-movement");

	useImperativeHandle(ref, () => ({
		showTweet(_) {},
	}));

	return (
		<WidescreenContainer>
			<TopBar>
				<img src={WidescreenTop} style={{ position: "absolute", height: "100%", right: -100 }} />
				<WideInfo
					timer={props.timer}
					runData={props.runData}
					style={{ timerSize: 100, timerStyle: { fontSize: 100 } }}
				/>
			</TopBar>
			<Sidebar>
				<Facecam
					height={422}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
					verticalCoop
				/>
				<SidebarBG>
					<RandomiserContainer>
						<RandomiserHeader>Movement Abilities</RandomiserHeader>
						<AbilityGrid>
							<Ability active={randomiserRep?.jump} name="Jump" />
							<Ability active={randomiserRep?.tripleJump} name="Triple Jump" />
							<Ability active={randomiserRep?.sideFlip} name="Side Flip" />
							<Ability active={randomiserRep?.longJump} name="Long Jump" />
							<Ability active={randomiserRep?.kick} name="Kick" />
							<Ability active={randomiserRep?.backFlip} name="Back Flip" />
							<Ability active={randomiserRep?.groundPound} name="Ground Pound" />
							<Ability active={randomiserRep?.wallKick} name="Wall Kick" />
							<Ability active={randomiserRep?.climb} name="Climb" />
							<Ability active={randomiserRep?.dive} name="Dive" />
							<Ability active={randomiserRep?.grab} name="Grab" />
							<Ability active={randomiserRep?.ledgeGrab} name="Ledge Grab" />
						</AbilityGrid>
						<ItemsRow>
							<ItemHeader>Keys</ItemHeader>
							<Items>
								<Item $active={randomiserRep?.keyUpstairs}>Upstairs</Item>
								<Item $active={randomiserRep?.keyDownstairs}>Downstairs</Item>
							</Items>
							<ItemHeader>Caps</ItemHeader>
							<Items>
								<Item $active={randomiserRep?.capWing}>Wing</Item>
								<Item $active={randomiserRep?.capMetal}>Metal</Item>
								<Item $active={randomiserRep?.capInvisibility}>Invisibility</Item>
							</Items>
						</ItemsRow>
					</RandomiserContainer>
				</SidebarBG>
			</Sidebar>
		</WidescreenContainer>
	);
});

const AbilityContainer = styled.div<{ $active?: boolean }>`
	color: ${(props) => (props.$active ? "#fff" : "rgba(255, 255, 255, 0.5)")};
	height: 84px;
	width: 250px;
	display: flex;
	align-items: center;
	justify-content: center;
	white-space: nowrap;
	position: relative;
`;

const AbilityBackground = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background: black;
`;

const Label = styled.span`
	z-index: 1;
`;

type AbilityProps = {
	name: string;
	active?: boolean;
};

gsap.registerPlugin(useGSAP);

const Ability = (props: AbilityProps) => {
	const labelRef = useRef<HTMLSpanElement>(null);
	const backgroundRef = useRef<HTMLDivElement>(null);

	useGSAP(() => {
		if (props.active) {
			// const tl = gsap.timeline();
			// tl.set(containerRef.current, { background: "transparent" });
			// tl.to(containerRef.current, { background: "black", duration: 2 });
			gsap.set(backgroundRef.current, { opacity: 0 });
			gsap.to(backgroundRef.current, { opacity: 1, duration: 2, delay: 3 });
			gsap.fromTo(
				labelRef.current,
				{ fontSize: "200%", rotateZ: "random(-45, 45)" },
				{ fontSize: "100%", rotateZ: 0, duration: 1, ease: "bounce.out" },
			);
		}
	}, [props.active]);

	return (
		<AbilityContainer $active={props.active}>
			<AbilityBackground ref={backgroundRef} />
			<Label ref={labelRef}>{props.name}</Label>
		</AbilityContainer>
	);
};

SM64MovementRando.displayName = "SM64Rando";
