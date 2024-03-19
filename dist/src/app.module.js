"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const events_module_1 = require("./events/events.module");
const mail_module_1 = require("./mail/mail.module");
const students_module_1 = require("./students/students.module");
const users_service_1 = require("./users/users.service");
const core_1 = require("@nestjs/core");
const authenticated_guard_1 = require("./auth/authenticated.guard");
const schedule_1 = require("@nestjs/schedule");
const scans_module_1 = require("./scans/scans.module");
const admins_module_1 = require("./admins/admins.module");
const sessions_module_1 = require("./sessions/sessions.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.0gnozrq.mongodb.net/?retryWrites=true&w=majority`, { dbName: 'LAU_EVENTS' }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            events_module_1.EventsModule,
            mail_module_1.MailModule,
            students_module_1.StudentsModule,
            scans_module_1.ScansModule,
            admins_module_1.AdminsModule,
            sessions_module_1.SessionsModule,
        ],
        providers: [
            app_service_1.AppService,
            users_service_1.UsersService,
            {
                provide: core_1.APP_GUARD,
                useClass: authenticated_guard_1.AuthenticatedGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map