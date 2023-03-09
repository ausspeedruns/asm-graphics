import * as nodecgApiContext from './nodecg-api-context';

const nodecg = nodecgApiContext.get();

const runnerReadyRep = nodecg.Replicant<boolean>('runner:ready');
const techReadyRep = nodecg.Replicant<boolean>('tech:ready', { defaultValue: false });

nodecg.listenFor('transition:toIntermission', () => {
	runnerReadyRep.value = false;
	techReadyRep.value = false;
});

nodecg.listenFor('runner:setReady', () => {
	runnerReadyRep.value = true;
});

nodecg.listenFor('runner:setNotReady', () => {
	runnerReadyRep.value = false;
});

// Shouldn't be here but WEEEEEEEEEEEEEEEEEEEEE
nodecg.listenFor('tech:setReady', () => {
	techReadyRep.value = true;
});

nodecg.listenFor('tech:setNotReady', () => {
	techReadyRep.value = false;
});
