import * as nodecgApiContext from './nodecg-api-context';

const nodecg = nodecgApiContext.get();

const runnerReadyRep = nodecg.Replicant<boolean>('runner:ready');

nodecg.listenFor('transition:toIntermission', () => {
	runnerReadyRep.value = false;
});

nodecg.listenFor('runner:setReady', () => {
	runnerReadyRep.value = true;
});

nodecg.listenFor('runner:setNotReady', () => {
	runnerReadyRep.value = false;
});
