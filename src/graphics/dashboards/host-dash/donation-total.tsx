import { useReplicant } from "@nodecg/react-hooks";
import { styled } from "styled-components";

const DonationTotalContainer = styled.div`
	container-type: size;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
`;

const Total = styled.div`
	font-family: var(--main-font);
	font-weight: bold;
	font-size: 75cqmin;
	text-align: center;
	font-variant-numeric: tabular-nums;
`;

export function DonationTotal() {
	const [donationTotalRep] = useReplicant<number>("donationTotal", { defaultValue: 100 });
	const [manualDonationRep] = useReplicant<number>("manual-donation-total", { defaultValue: 100 });

	return (
		<DonationTotalContainer>
			<Total>${((donationTotalRep ?? 0) + (manualDonationRep ?? 0)).toLocaleString()}</Total>
		</DonationTotalContainer>
	);
}
