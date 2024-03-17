"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScansController = void 0;
const common_1 = require("@nestjs/common");
const scans_service_1 = require("./scans.service");
const event_id_pipe_1 = require("./validations/event-id-pipe");
const scan_event_dto_1 = require("./dto/scan-event.dto");
let ScansController = class ScansController {
    constructor(scansService) {
        this.scansService = scansService;
    }
    async scanEvent(scanEventDto, response, eventId, request) {
        try {
            await this.scansService.scanEvent(scanEventDto, eventId, request);
            return response.status(201).json({
                message: 'User has been registered successfully',
            });
        }
        catch (err) {
            return response.status(err.status).json({
                status: err.status,
                message: err.message,
            });
        }
    }
    async getEventAttendees(eventId, response, request) {
        try {
            const attendees = await this.scansService.getEventAttendees(eventId, request);
            return response.status(200).json({
                attendees,
            });
        }
        catch (err) {
            return response.status(err.status).json({
                status: err.status,
                message: err.message,
            });
        }
    }
};
exports.ScansController = ScansController;
__decorate([
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('id', event_id_pipe_1.IsValidMongoIdPipe)),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [scan_event_dto_1.ScanEventDto, Object, String, Object]),
    __metadata("design:returntype", Promise)
], ScansController.prototype, "scanEvent", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', event_id_pipe_1.IsValidMongoIdPipe)),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ScansController.prototype, "getEventAttendees", null);
exports.ScansController = ScansController = __decorate([
    (0, common_1.Controller)('scans'),
    __metadata("design:paramtypes", [scans_service_1.ScansService])
], ScansController);
//# sourceMappingURL=scans.controller.js.map