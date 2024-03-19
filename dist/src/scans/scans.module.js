"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScansModule = void 0;
const common_1 = require("@nestjs/common");
const scans_controller_1 = require("./scans.controller");
const scans_service_1 = require("./scans.service");
const mongoose_1 = require("@nestjs/mongoose");
const scan_schema_1 = require("./schemas/scan.schema");
const students_module_1 = require("../students/students.module");
const events_module_1 = require("../events/events.module");
let ScansModule = class ScansModule {
};
exports.ScansModule = ScansModule;
exports.ScansModule = ScansModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'Scan', schema: scan_schema_1.ScanSchema }]), (0, common_1.forwardRef)(() => students_module_1.StudentsModule), (0, common_1.forwardRef)(() => events_module_1.EventsModule)],
        controllers: [scans_controller_1.ScansController],
        providers: [scans_service_1.ScansService],
        exports: [scans_service_1.ScansService, mongoose_1.MongooseModule]
    })
], ScansModule);
//# sourceMappingURL=scans.module.js.map