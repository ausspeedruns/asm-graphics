import * as nodecgApiContext from './nodecg-api-context';
import _ from 'underscore';

import type { Donation } from '@asm-graphics/types/Donations';
import type NodeCG from '@nodecg/types';

const nodecg = nodecgApiContext.get();

const donationsRep = nodecg.Replicant('donations') as unknown as NodeCG.ServerReplicantWithSchemaDefault<Donation[]>;
const manualDonationsRep = nodecg.Replicant('manual-donations') as unknown as NodeCG.ServerReplicantWithSchemaDefault<Donation[]>;
const manualDonationTotalRep = nodecg.Replicant('manual-donation-total') as unknown as NodeCG.ServerReplicantWithSchemaDefault<number>;

nodecg.listenFor('donations:toggleRead', (id: string) => {
	const donationIndex = donationsRep.value.findIndex(donation => donation.id === id);

	const newObj = _.clone(donationsRep.value[donationIndex]);
	newObj.read = !newObj.read;

	donationsRep.value[donationIndex] = newObj;
});

nodecg.listenFor('manual-donations:toggleRead', (id: string) => {
	const donationIndex = manualDonationsRep.value.findIndex(donation => donation.id === id);

	const newObj = _.clone(manualDonationsRep.value[donationIndex]);
	newObj.read = !newObj.read;

	manualDonationsRep.value[donationIndex] = newObj;
});

nodecg.listenFor('manual-donations:new', (dono: Donation) => {
	const newObj = _.clone(manualDonationsRep.value);
	newObj.push(dono);

	manualDonationsRep.value = newObj;
	manualDonationTotalRep.value! += dono.amount;
});

nodecg.listenFor('manual-donations:remove', (id: string) => {
	const donationIndex = manualDonationsRep.value.findIndex(donation => donation.id === id);

	manualDonationTotalRep.value! -= manualDonationsRep.value[donationIndex].amount;

	const newObj = _.clone(manualDonationsRep.value);
	newObj.splice(donationIndex, 1);

	manualDonationsRep.value = newObj;
});
