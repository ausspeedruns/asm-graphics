import * as nodecgApiContext from './nodecg-api-context';

import {StaffMessage} from '../types/StaffMessages';

const nodecg = nodecgApiContext.get();

const staffMessagesRep = nodecg.Replicant<StaffMessage[]>('staff-messages', { defaultValue: [] });

nodecg.listenFor('staff-sendMessage', (msg: StaffMessage) => {
	staffMessagesRep.value.push(msg);
});
