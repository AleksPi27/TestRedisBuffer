"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSizeLimit = exports.getAppPort = exports.getTimeoutLimit = void 0;
function getTimeoutLimit() {
    const limitMs = process.env.MAX_TIME_BUFFER_INTERVAL;
    return parseInt(limitMs) * 1000;
}
exports.getTimeoutLimit = getTimeoutLimit;
function getAppPort() {
    const port = process.env.PORT || "3000";
    return parseInt(port);
}
exports.getAppPort = getAppPort;
function getSizeLimit() {
    const size = process.env.MAX_BUFFER_SIZE;
    return parseInt(size);
}
exports.getSizeLimit = getSizeLimit;
//# sourceMappingURL=utils.js.map