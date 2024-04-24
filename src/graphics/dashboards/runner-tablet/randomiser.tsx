import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";

import { SM64MovementAbilities } from "extensions/sm64-rando";
import { Button } from "@mui/material";

const RTRandoContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	padding-bottom: 48px;
`;

const ButtonGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	width: 100%;
	height: 100%;
	gap: 16px;
`;

const Header = styled.h1`
	margin: 0;
	padding: 0;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

const capKeys = ["capInvisibility", "capMetal", "capWing"];
const keyKeys = ["keyDownstairs", "keyUpstairs"];

export const RTRandomiser: React.FC<Props> = (props: Props) => {
	const [randomiserRep] = useReplicant<SM64MovementAbilities>("rando:sm64-movement");

	const excludedKeys = [...capKeys, ...keyKeys];
	const filteredRep = Object.fromEntries(
		Object.entries(randomiserRep ?? []).filter(([itemName]) => !excludedKeys.includes(itemName)),
	);
	const keysObject = Object.fromEntries(
		Object.entries(randomiserRep ?? []).filter(([itemName]) => keyKeys.includes(itemName)),
	);
	const capsObject = Object.fromEntries(
		Object.entries(randomiserRep ?? []).filter(([itemName]) => capKeys.includes(itemName)),
	);

	return (
		<RTRandoContainer className={props.className} style={props.style}>
			<ButtonGrid style={{ flexGrow: 3 }}>
				{Object.entries(filteredRep).map(([itemName, checked]) => {
					return <RandoButton checked={checked} item={itemName} />;
				})}
			</ButtonGrid>
			<Header>KEYS</Header>
			<ButtonGrid style={{ height: "20%", gridTemplateColumns: "1fr 1fr" }}>
				{Object.entries(keysObject).map(([itemName, checked]) => {
					return <RandoButton checked={checked} item={itemName} />;
				})}
			</ButtonGrid>
			<Header>CAPS</Header>
			<ButtonGrid style={{ height: "20%" }}>
				{Object.entries(capsObject).map(([itemName, checked]) => {
					return <RandoButton checked={checked} item={itemName} />;
				})}
			</ButtonGrid>
		</RTRandoContainer>
	);
};

const ToggleButton = styled(Button)<{ $active?: boolean }>`

	&.MuiButton-contained {
		font-size: 32px;

		${(props) =>
			props.$active
				? css`
						background: #4caf50;
					`
				: css`
						background: #d32f2f;
						color: white;
					`}
	}
`;

function camelCaseToWords(s: string) {
	const result = s.replace(/([A-Z])/g, " $1");
	return result.charAt(0).toUpperCase() + result.slice(1);
}

type RandoButtonProps = {
	item: string;
	checked: boolean;
};

const RandoButton = (props: RandoButtonProps) => {
	function handlePress() {
		if (props.checked) {
			nodecg.sendMessage("rando:lock", { game: "SM64-Movement", item: props.item });
		} else {
			nodecg.sendMessage("rando:unlock", { game: "SM64-Movement", item: props.item });
		}
	}

	return (
		<ToggleButton variant="contained" fullWidth $active={props.checked} onClick={handlePress}>
			{camelCaseToWords(props.item)}
		</ToggleButton>
	);
};
