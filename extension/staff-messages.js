"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const nodecg = nodecgApiContext.get();
const staffMessagesRep = nodecg.Replicant('staff-messages');
nodecg.listenFor('staff-sendMessage', (msg) => {
    staffMessagesRep.value.push(msg);
});
