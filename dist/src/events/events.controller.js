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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const common_2 = require("@nestjs/common");
const index_dto_1 = require("./dto/index.dto");
const event_id_pipe_1 = require("../scans/validations/event-id-pipe");
let EventsController = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async getUserEvents(request, response) {
        const user = request.user;
        try {
            const events = await this.eventsService.getUserEvents(user._id);
            return response.status(200).send({
                events,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async getActiveUserEvents(request) {
        const user = request.user;
        try {
            const events = await this.eventsService.getActiveUserEvents(user._id);
            return events;
        }
        catch (err) {
            return err;
        }
    }
    async createEvent(request, createEventDto, response) {
        const user = request.user;
        if (!createEventDto.users) {
            createEventDto.users = [];
        }
        createEventDto.users.push(user._id);
        try {
            const newEvent = await this.eventsService.createEvent(createEventDto);
            return response.status(201).json({
                message: 'Event has been created successfully',
                newEvent,
            });
        }
        catch (err) {
            return response.status(err.status).json({
                status: err.status,
                message: err.message,
            });
        }
    }
    async deleteEvent(eventId, response, request) {
        try {
            const user = request.user;
            const event = await this.eventsService.deleteEvent(eventId, user);
            return response.status(200).json({
                message: 'Event has been deleted successfully',
                event,
            });
        }
        catch (err) {
            return response.status(err.status).json({
                status: err.status,
                message: err.message,
            });
        }
    }
    async updateEvent(eventId, response, request, updateEventDto) {
        try {
            const user = request.user;
            const event = await this.eventsService.updateEventEndDate(eventId, user, updateEventDto);
            return response.status(200).json({
                message: 'Event has been updated successfully',
                event,
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
exports.EventsController = EventsController;
__decorate([
    (0, common_2.Get)(),
    __param(0, (0, common_2.Req)()),
    __param(1, (0, common_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getUserEvents", null);
__decorate([
    (0, common_2.Get)('active'),
    __param(0, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getActiveUserEvents", null);
__decorate([
    (0, common_2.Post)(),
    __param(0, (0, common_2.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, index_dto_1.CreateEventDto, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createEvent", null);
__decorate([
    (0, common_2.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', event_id_pipe_1.IsValidMongoIdPipe)),
    __param(1, (0, common_2.Res)()),
    __param(2, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "deleteEvent", null);
__decorate([
    (0, common_2.Put)(':id'),
    __param(0, (0, common_1.Param)('id', event_id_pipe_1.IsValidMongoIdPipe)),
    __param(1, (0, common_2.Res)()),
    __param(2, (0, common_2.Req)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, index_dto_1.UpdateEventEndDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateEvent", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map