"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyService = void 0;
const moment = require("moment-timezone");
class MyService {
    getCurrentTimeInTimezone(timezone) {
        return moment().tz(timezone).format();
    }
}
exports.MyService = MyService;
//# sourceMappingURL=date.js.map