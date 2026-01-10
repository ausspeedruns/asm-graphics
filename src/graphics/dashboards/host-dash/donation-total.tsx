import { useReplicant } from "@nodecg/react-hooks";
import styled from "@emotion/styled";

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
	const [donationTotalRep] = useReplicant("donationTotal");
	const [manualDonationRep] = useReplicant("manual-donation-total");

	return (
		<DonationTotalContainer>
			<Total>${((donationTotalRep ?? 0) + (manualDonationRep ?? 0)).toLocaleString()}</Total>
		</DonationTotalContainer>
	);
}
