"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUtcToBeirutTime = void 0;
const moment = require("moment-timezone");
moment.tz.setDefault('Asia/Beirut');
const convertUtcToBeirutTime = (utcTimestamp) => {
    return moment(utcTimestamp).format('MM/DD/YYYY HH:mm:ss');
};
exports.convertUtcToBeirutTime = convertUtcToBeirutTime;
//# sourceMappingURL=date-utils.js.map