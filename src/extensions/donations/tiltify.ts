import * as nodecgApiContext from '../nodecg-api-context';

import { Donation } from '../../types/Donations';

const nodecg = nodecgApiContext.get();
const donationTotalRep = nodecg.Replicant<number>('donationTotal');
const donationsListRep = nodecg.Replicant<Donation[]>('donations');

// nodecg-tiltify replicants
interface TiltifyDonation {
	id: number;
	amount: number;
	name: string;
	comment: string;
	completedAt: number;
};

const tiltifyTotalRep = nodecg.Replicant<number>('total', 'nodecg-tiltify');
const tiltifyDonationsRep = nodecg.Replicant<TiltifyDonation[]>('allDonations', 'nodecg-tiltify');


tiltifyTotalRep.on('change', newVal => {
	donationTotalRep.value = newVal;
});

tiltifyDonationsRep.on('change', newVal => {
	if (!newVal) return;
	newVal.forEach(donation => {
		if (!donationsListRep.value?.find(donate => donate.id === donation.id)) {
			donationsListRep.value?.push({
				amount: donation.amount,
				currencySymbol: '$',
				id: donation.id.toString(),
				name: donation.name,
				time: donation.completedAt.toString(),
				read: false,
				desc: donation.comment ?? ''
			});
		}
	});
});
