// Mostly handles the activation and deactivation of incentives
import { Goal, War } from '../types/Incentives';
import * as nodecgApiContext from './nodecg-api-context';

const nodecg = nodecgApiContext.get();

const incentivesRep = nodecg.Replicant<(Goal | War)[]>('incentives', { defaultValue: [] });

nodecg.listenFor('disableIncentive', (index: number) => {
	const incentiveIndex = incentivesRep.value.findIndex(incentive => incentive.index === index);

	if (incentiveIndex === -1) return nodecg.log.error(`[Incentives] Tried to disable incentive index: ${index} but could not find in list.`);

	incentivesRep.value[incentiveIndex].active = false;
});

// Dunno why this would be used but just in case :)
nodecg.listenFor('activateIncentive', (index: number) => {
	const incentiveIndex = incentivesRep.value.findIndex(incentive => incentive.index === index);

	if (incentiveIndex === -1) return nodecg.log.error(`[Incentives] Tried to activate incentive index: ${index} but could not find in list.`);

	incentivesRep.value[incentiveIndex].active = true;
});
