import * as nodecgApiContext from './nodecg-api-context';
import _ from 'underscore';

import { Donation } from '../types/Donations';

const nodecg = nodecgApiContext.get();

const donationsRep = nodecg.Replicant<Donation[]>('donations');

nodecg.listenFor('donations:toggleRead', (id: string) => {
	const donationIndex = donationsRep.value.findIndex(donation => donation.id === id);

	const newObj = _.clone(donationsRep.value[donationIndex]);
	newObj.read = !newObj.read;

	donationsRep.value[donationIndex] = newObj;
});
