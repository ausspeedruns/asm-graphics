'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = void 0;
let context;
function get() {
    return context;
}
exports.get = get;
function set(ctx) {
    context = ctx;
}
exports.set = set;
