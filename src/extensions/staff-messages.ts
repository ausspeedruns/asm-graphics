import * as nodecgApiContext from './nodecg-api-context';

import type { StaffMessage } from '@asm-graphics/types/StaffMessages';
import type NodeCG from '@alvancamp/test-nodecg-types';

const nodecg = nodecgApiContext.get();

const staffMessagesRep = nodecg.Replicant('staff-messages') as unknown as NodeCG.ServerReplicantWithSchemaDefault<StaffMessage[]>;

nodecg.listenFor('staff-sendMessage', (msg: StaffMessage) => {
	staffMessagesRep.value.push(msg);
});
