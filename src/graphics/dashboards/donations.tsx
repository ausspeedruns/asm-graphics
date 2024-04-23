import React from "react";
import styled, { keyframes } from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";
import _ from "underscore";
import { Box, Grid, Tooltip } from "@mui/material";
import { Check } from "@mui/icons-material";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import { Donation } from "@asm-graphics/types/Donations";

import { GreenButton } from "../../dashboard/elements/styled-ui";

const DonationsContainer = styled.div`
	height: calc(100% - 56px);
	overflow-x: hidden;
	overflow-y: auto;
`;

// Donation object example
// desc: "for PeekingBoo a joy to watch and listen to! Goodluck!"
// id: "donation-18005983"
// read: false
// time: "2020-11-25T09:48:38.144Z"
// title: "Pip donated $22"
// used: false

// interface TiltifyDonation {
// 	id: number,
// 	amount: number,
// 	name: string,
// 	comment: string,
// 	completedAt: number,
// 	updatedAt: number,
// 	sustained: boolean,
// 	shown: boolean,
// 	read: boolean
// }

export const Donations: React.FC = () => {
	const [donations] = useReplicant<Donation[]>("donations");

	const reversedDonations = [...donations ?? []].reverse() ?? [];

	return (
		<DonationsContainer>
			<div style={{ padding: "0 8px", height: "100%" }}>
				{reversedDonations.length > 0 && (
					<AutoSizer>
						{({ height, width }) => (
							<List
								height={height}
								width={width}
								itemCount={reversedDonations.length}
								itemData={reversedDonations}
								itemSize={(index) => getRowHeight(reversedDonations?.[index].desc ?? "")}>
								{VirtualisedDonation}
							</List>
						)}
					</AutoSizer>
				)}
			</div>
		</DonationsContainer>
	);
};

/* Single Donation */

interface DonationProps {
	donation: Donation;
	style: React.CSSProperties;
}

const NewFlash = keyframes`
	from { background-color: #000000; }
	to { background-color: #eee; }
`;

const MARGIN = 6;
const PADDING = 8;

const DonationContainer = styled(Box)`
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	border-radius: 7px;
	/* animation-name: ${NewFlash};
	animation-duration: 0.5s; */
	background-color: #eee;
	position: relative;
	padding: ${PADDING}px;
`;

const Amount = styled.span`
	font-weight: bold;
	font-size: 1.2rem;
	margin-right: 6px;
`;

const Name = styled.span`
	font-weight: bold;
	font-size: 1.2rem;
`;

const DateText = styled.span`
	color: #aaa;
`;

const DisabledCover = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
	background: rgba(0, 0, 0, 0.35);
	top: 0px;
	left: 0px;
	border-radius: 7px;
`;

function getRowHeight(description: string) {
	return 96 + Math.floor(description.length / 2.5);
}

type ReactWindowElement<T> = {
	index: number;
	style: React.CSSProperties;
	data: Array<T>;
};

const VirtualisedDonation = ({ index, style, data }: ReactWindowElement<Donation>) => {
	return (
		<DonationEl
			style={{
				...style,
				top: parseFloat(style?.top?.toString() ?? "0") + (MARGIN + PADDING) * 2,
				height: parseFloat(style?.height?.toString() ?? "0") - (MARGIN + PADDING) * 2,
				width: "97%",
			}}
			donation={data[index]}
		/>
	);
};

const DonationEl: React.FC<DonationProps> = (props: DonationProps) => {
	const timeText = new Date(props.donation.time).toLocaleTimeString();

	const toggleRead = () => {
		nodecg.sendMessage("markDonationReadUnread", props.donation.id);
	};

	return (
		<DonationContainer
			boxShadow={2}
			style={{
				...props.style,
				paddingTop: MARGIN,
			}}>
			<Grid direction="column" container style={{ paddingRight: 4 }}>
				<div>
					<Amount>
						${props.donation.amount.toLocaleString()}
						{props.donation.currencyCode !== "AUD" ? ` ${props.donation.currencyCode}` : ""}
					</Amount>
					<Name>{props.donation.name}</Name>
				</div>
				<DateText>{timeText}</DateText>
				<span style={{ fontStyle: props.donation.desc ? "" : "italic" }}>
					{_.unescape(props.donation.desc || "No comment").replace("&#39;", "'")}
				</span>
			</Grid>

			{props.donation.read ? (
				<DisabledCover />
			) : (
				<Tooltip title="Mark as read" placement="top">
					<GreenButton variant="contained" onClick={toggleRead}>
						<Check />
					</GreenButton>
				</Tooltip>
			)}
		</DonationContainer>
	);
};
