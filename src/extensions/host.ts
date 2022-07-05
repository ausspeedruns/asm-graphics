import * as nodecgApiContext from './nodecg-api-context';
import { CouchPerson } from '../types/OverlayProps';

const nodecg = nodecgApiContext.get();

const hostNameRep = nodecg.Replicant<CouchPerson>('couch-names');

