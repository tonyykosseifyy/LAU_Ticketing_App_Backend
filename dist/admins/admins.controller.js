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
exports.AdminsController = void 0;
const common_1 = require("@nestjs/common");
const admins_service_1 = require("./admins.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_roles_1 = require("../auth/user-roles");
const common_2 = require("@nestjs/common");
const interceptor_1 = require("./interceptor");
const update_event_dto_1 = require("../events/dto/update-event.dto");
const admin_create_event_dto_1 = require("../events/dto/admin-create-event.dto");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const student_id_pipe_1 = require("../students/validations/student-id-pipe");
const update_user_dto_1 = require("../users/dto/update-user.dto");
const create_student_dto_1 = require("../students/dto/create-student.dto");
const update_student_dto_1 = require("../students/dto/update-student.dto");
let AdminsController = class AdminsController {
    constructor(adminsService) {
        this.adminsService = adminsService;
    }
    async getAllEvents(response) {
        try {
            const events = await this.adminsService.getAllEvents();
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
    async getEvent(request, response) {
        const eventId = request.params.id;
        try {
            const event = await this.adminsService.getEventById(eventId);
            return response.status(200).send({
                event,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async updateEvent(request, response, updateEventDto) {
        const eventId = request.params.id;
        const payload = request.body;
        try {
            const event = await this.adminsService.updateEvent(eventId, payload);
            return response.status(200).send({
                message: `Event ${eventId} has been updated successfully`,
                event,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async createEvent(response, createEventDto) {
        try {
            const event = await this.adminsService.createEvent(createEventDto);
            return response.status(201).send({
                message: `Event has been created successfully`,
                event,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async deleteEvent(request, response) {
        const eventId = request.params.id;
        try {
            const event = await this.adminsService.deleteEvent(eventId);
            return response.status(200).send({
                message: `Event ${eventId} has been deleted successfully`,
                event,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async getAllUsers(response) {
        try {
            const users = await this.adminsService.getAllUsers();
            return response.status(200).send({
                users,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async getDetailedUsers(response) {
        try {
            const users = await this.adminsService.getDetailedUsers();
            return response.status(200).send({
                users,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async registerUser(response, user) {
        try {
            const newUser = await this.adminsService.registerUser(user);
            return response.status(201).send({
                message: `User ${newUser.name} has been created successfully`,
                user: newUser,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async getUserById(userId, response) {
        try {
            const user = await this.adminsService.getUserById(userId);
            return response.status(200).send({
                user,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async updateUser(response, user, request) {
        const userId = request.params.id;
        try {
            const newUser = await this.adminsService.updateUser(user, userId);
            return response.status(200).send({
                message: `User ${newUser.name} has been updated successfully`,
                user: newUser,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async deleteUser(request, response) {
        const userId = request.params.id;
        try {
            const user = await this.adminsService.deleteUser(userId);
            return response.status(200).send({
                message: `User ${user.name} has been deleted successfully`,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async getStudents(response) {
        try {
            const students = await this.adminsService.getStudents();
            return response.status(200).send({
                students,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async getStudentById(student_id, response) {
        try {
            const student = await this.adminsService.getStudentById(student_id);
            return response.status(200).send({
                student,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async updateStudent(student_id, response, updateStudentDto) {
        try {
            const student = await this.adminsService.updateStudent(updateStudentDto, student_id);
            return response.status(200).send({
                message: `Student ${student.name} has been updated successfully`,
                student,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async createStudent(response, createStudentDto) {
        try {
            const student = await this.adminsService.createStudent(createStudentDto);
            return response.status(201).send({
                message: `Student ${student.name} has been created successfully`,
                student,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
    async deleteStudent(student_id, response) {
        try {
            await this.adminsService.deleteStudent(student_id);
            return response.status(200).send({
                message: `Student ${student_id} has been deleted successfully`,
            });
        }
        catch (err) {
            return response.status(err?.status).json({
                status: err?.status,
                message: err.message,
            });
        }
    }
};
exports.AdminsController = AdminsController;
__decorate([
    (0, common_1.Get)('/events'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getAllEvents", null);
__decorate([
    (0, common_1.Get)('/events/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getEvent", null);
__decorate([
    (0, common_1.Put)('/events/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, update_event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Post)('/events'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_create_event_dto_1.CreateEventDtoAdmin]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Delete)('/events/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "deleteEvent", null);
__decorate([
    (0, common_1.Get)('/users'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('/users/detailed'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getDetailedUsers", null);
__decorate([
    (0, common_1.Post)('/users'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Get)("/users/:id"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)('/users/:id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('/users/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)("/students"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Get)("/students/:id"),
    __param(0, (0, common_1.Param)('id', student_id_pipe_1.StudentIdPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getStudentById", null);
__decorate([
    (0, common_1.Put)('/students/:id'),
    __param(0, (0, common_1.Param)('id', student_id_pipe_1.StudentIdPipe)),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "updateStudent", null);
__decorate([
    (0, common_1.Post)('/students'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "createStudent", null);
__decorate([
    (0, common_1.Delete)('/students/:id'),
    __param(0, (0, common_1.Param)('id', student_id_pipe_1.StudentIdPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "deleteStudent", null);
exports.AdminsController = AdminsController = __decorate([
    (0, common_2.UseInterceptors)(interceptor_1.RolesInterceptor),
    (0, roles_decorator_1.Roles)(user_roles_1.UserRole.Admin),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [admins_service_1.AdminsService])
], AdminsController);
//# sourceMappingURL=admins.controller.js.map