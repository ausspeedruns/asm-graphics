import * as nodecgApiContext from './nodecg-api-context';
import { CouchPerson } from '../types/OverlayProps';

const nodecg = nodecgApiContext.get();

const hostNameRep = nodecg.Replicant<CouchPerson>('host', { defaultValue: {name: '', pronouns: ''} });

nodecg.listenFor('update-hostname', (data: CouchPerson) => {
	hostNameRep.value = data;
});
