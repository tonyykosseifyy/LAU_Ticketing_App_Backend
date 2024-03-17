"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const events_controller_1 = require("./events.controller");
const mongoose_1 = require("@nestjs/mongoose");
const event_schema_1 = require("./schemas/event.schema");
const users_module_1 = require("../users/users.module");
const students_module_1 = require("../students/students.module");
const mail_module_1 = require("../mail/mail.module");
const scans_module_1 = require("../scans/scans.module");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Event', schema: event_schema_1.EventSchema }]),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            students_module_1.StudentsModule,
            mail_module_1.MailModule,
            scans_module_1.ScansModule,
        ],
        providers: [events_service_1.EventsService],
        controllers: [events_controller_1.EventsController],
        exports: [events_service_1.EventsService, mongoose_1.MongooseModule]
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map