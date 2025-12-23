import type { Donation } from "@asm-graphics/types/Donations.js";
import * as nodecgApiContext from "./nodecg-api-context.js";

import { donationsRep, manualDonationsRep, manualDonationTotalRep } from "./replicants.js";

const nodecg = nodecgApiContext.get();

nodecg.listenFor("donations:toggleRead", (id) => {
	const [donation, donationIndex] = getDonation(id);

	if (!donation || donationIndex === -1) {
		nodecg.log.warn(`Tried to toggle read state of donation with ID ${id}, but it doesn't exist.`);
		return;
	}

	const newObj = { ...donation };
	newObj.read = !newObj.read;

	donationsRep.value[donationIndex] = newObj;
});

nodecg.listenFor("manual-donations:toggleRead", (id) => {
	const [donation, donationIndex] = getManualDonation(id);

	if (!donation || donationIndex === -1) {
		nodecg.log.warn(`Tried to toggle read state of manual donation with ID ${id}, but it doesn't exist.`);
		return;
	}

	const newObj = { ...donation };
	newObj.read = !newObj.read;

	manualDonationsRep.value[donationIndex] = newObj;
});

nodecg.listenFor("manual-donations:new", (dono) => {
	const newObj = [...manualDonationsRep.value];
	newObj.push(dono);

	manualDonationsRep.value = newObj;
	manualDonationTotalRep.value! += dono.amount;
});

nodecg.listenFor("manual-donations:remove", (id) => {
	const [donation, donationIndex] = getManualDonation(id);

	if (!donation || donationIndex === -1) {
		nodecg.log.warn(`Tried to remove manual donation with ID ${id}, but it doesn't exist.`);
		return;
	}

	manualDonationTotalRep.value! -= donation.amount;

	const newObj = [...manualDonationsRep.value];
	newObj.splice(donationIndex, 1);

	manualDonationsRep.value = newObj;
});

function getDonation(id: string): [Donation | null, number] {
	const donationIndex = donationsRep.value.findIndex((donation) => donation.id === id);

	if (donationIndex === -1) {
		return [null, -1];
	}

	const donation = donationsRep.value[donationIndex];

	if (!donation) {
		return [null, -1];
	}

	return [donation, donationIndex];
}

function getManualDonation(id: string): [Donation | null, number] {
	const donationIndex = manualDonationsRep.value.findIndex((donation) => donation.id === id);

	if (donationIndex === -1) {
		return [null, -1];
	}

	const donation = manualDonationsRep.value[donationIndex];

	if (!donation) {
		return [null, -1];
	}

	return [donation, donationIndex];
}
