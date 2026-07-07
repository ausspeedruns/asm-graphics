import { useRef, useState } from "react";
import clsx from "clsx";
import { Button, Checkbox, FormControlLabel, Stack, TextField } from "@mui/material";
import styles from "./testing.module.css";
import type { TickerItemHandles } from "../../ticker";
import gsap from "gsap";
import NumberField from "../../elements/number-field";
import type { DonationMatch } from "@asm-graphics/types/Donations";
import { TickerDonationMatches } from "../donation-matches";

interface DonationMatchesProps {
	showcaseBackgroundColour: string;
}

export function DonationMatches(props: DonationMatchesProps) {
	const [donationMatches, setDonationMatches] = useState<DonationMatch[]>([
		{
			desc: "Description of the donation match",
			id: "donation-match-1",
			read: false,
			time: Date.now(),
			name: "John AusSpeedruns",
			amount: 100,
			currencySymbol: "$",
			currencyCode: "USD",

			pledge: 200,
			endsAt: Date.now() + 1000000,
			completedAt: 0,
			active: true,
			updated: Date.now(),
		},
	]);

	const ref = useRef<TickerItemHandles>(null);

	function handleRunAnimation() {
		if (!ref.current) return;

		const tl = gsap.timeline();
		ref.current.animation(tl);
		tl.play();
	}

	function handleDonationMatchChange(index: number, field: keyof DonationMatch, value: string | number | boolean) {
		const newDonationMatches = [...donationMatches];

		const originalData = newDonationMatches[index];
		if (!originalData) return;

		newDonationMatches[index] = { ...originalData, [field]: value };
		setDonationMatches(newDonationMatches);
	}

	return (
		<div className={styles.container}>
			<h2>Donation Matches</h2>
			<div
				className={clsx(styles.showcase, styles.fullWidth)}
				style={{ backgroundColor: props.showcaseBackgroundColour }}
			>
				<TickerDonationMatches donationMatches={donationMatches} ref={ref} />
			</div>
			<div className={styles.controls}>
				<Button onClick={handleRunAnimation}>Run Animation</Button>
				{donationMatches.map((donationMatch, index) => (
					<div key={index}>
						<FormControlLabel
							control={<Checkbox defaultChecked />}
							label="Active"
							checked={donationMatch.active}
							onChange={(_, checked) => handleDonationMatchChange(index, "active", checked)}
						/>
						<TextField
							label={`Donation Match ${index + 1} Name`}
							variant="outlined"
							value={donationMatch.name}
							onChange={(e) => handleDonationMatchChange(index, "name", e.target.value)}
						/>
						<TextField
							label={`Donation Match ${index + 1} Description`}
							variant="outlined"
							value={donationMatch.desc}
							onChange={(e) => handleDonationMatchChange(index, "desc", e.target.value)}
						/>
						<NumberField
							label={`Donation Match ${index + 1} Amount`}
							value={donationMatch.amount}
							onValueChange={(value) => handleDonationMatchChange(index, "amount", Number(value))}
						/>
						<NumberField
							label={`Donation Match ${index + 1} Time`}
							value={donationMatch.time}
							onValueChange={(value) => handleDonationMatchChange(index, "time", Number(value))}
						/>
						<NumberField
							label={`Donation Match ${index + 1} Pledge`}
							value={donationMatch.pledge}
							onValueChange={(value) => handleDonationMatchChange(index, "pledge", Number(value))}
						/>
						<Stack direction="row" spacing={2}>
							<NumberField
								label={`Donation Match ${index + 1} Ends At`}
								value={donationMatch.endsAt}
								onValueChange={(value) => handleDonationMatchChange(index, "endsAt", Number(value))}
							/>
							<Button
								onClick={() =>
									handleDonationMatchChange(index, "endsAt", donationMatch.endsAt + 15 * 60 * 1000)
								}
							>
								+15 Mins
							</Button>
						</Stack>
						<NumberField
							label={`Donation Match ${index + 1} Completed At`}
							value={donationMatch.completedAt}
							onValueChange={(value) => handleDonationMatchChange(index, "completedAt", Number(value))}
						/>
					</div>
				))}
				<Button
					variant="outlined"
					onClick={() =>
						setDonationMatches([
							...donationMatches,
							{
								id: `donation-match-${donationMatches.length + 1}`,
								name: "",
								desc: "",
								amount: 0,
								time: 0,
								pledge: 0,
								endsAt: Date.now() + 15 * 60 * 1000, // Now + 15 minutes
								completedAt: 0,
								active: true,
								read: false,
								currencySymbol: "$",
								currencyCode: "USD",
								updated: Date.now(),
							},
						])
					}
				>
					Add Donation Match
				</Button>
				<Button
					variant="outlined"
					onClick={() => setDonationMatches(donationMatches.slice(0, -1))}
					disabled={donationMatches.length === 0}
				>
					Remove Last Donation Match
				</Button>
			</div>
		</div>
	);
}
