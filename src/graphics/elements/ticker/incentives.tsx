import { useRef } from "react";
import styled from "styled-components";

import { TickerTitle } from "./title";

import type { Incentive } from "@asm-graphics/types/Incentives";
import type { TickerItemHandles } from "../ticker";

const TickerIncentivesContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
	color: var(--text-light);
	font-size: 30px;
	transform: translate(0, -64px);
	overflow: hidden;
	z-index: 2;
	font-family: var(--secondary-font);
`;

const MultiIncentiveContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	position: relative;
`;

interface Props {
    incentives: Incentive[];
    ref: React.Ref<TickerItemHandles>;
}

export function TickerIncentives(props: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <TickerIncentivesContainer ref={containerRef}>
            <TickerTitle>
                Incentives
                <br />
                Wars
            </TickerTitle>
            <MultiIncentiveContainer>{allGoals}</MultiIncentiveContainer>
        </TickerIncentivesContainer>
    )
}
