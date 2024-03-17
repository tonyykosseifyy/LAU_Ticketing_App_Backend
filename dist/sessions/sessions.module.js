"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsModule = void 0;
const common_1 = require("@nestjs/common");
const sessions_service_1 = require("./sessions.service");
const session_schema_1 = require("./schemas/session.schema");
const mongoose_1 = require("@nestjs/mongoose");
const users_module_1 = require("../users/users.module");
let SessionsModule = class SessionsModule {
};
exports.SessionsModule = SessionsModule;
exports.SessionsModule = SessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: "Session", schema: session_schema_1.SessionSchema }]), users_module_1.UsersModule],
        providers: [sessions_service_1.SessionsService],
        exports: [sessions_service_1.SessionsService]
    })
], SessionsModule);
//# sourceMappingURL=sessions.module.js.map