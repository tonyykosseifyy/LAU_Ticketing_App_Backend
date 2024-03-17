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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../events/events.service");
const users_service_1 = require("../users/users.service");
const students_service_1 = require("../students/students.service");
const common_2 = require("@nestjs/common");
const sessions_service_1 = require("../sessions/sessions.service");
let AdminsService = class AdminsService {
    constructor(eventsService, usersService, studentsService, sessions) {
        this.eventsService = eventsService;
        this.usersService = usersService;
        this.studentsService = studentsService;
        this.sessions = sessions;
    }
    async getAllEvents() {
        return await this.eventsService.getAllEvents();
    }
    async getEventById(eventId) {
        return await this.eventsService.getEventById(eventId);
    }
    async createEvent(createEventDto) {
        return await this.eventsService.createAdminEvent(createEventDto);
    }
    async updateEvent(eventId, payload) {
        return await this.eventsService.updateEvent(eventId, payload);
    }
    async deleteEvent(eventId) {
        return await this.eventsService.deleteEventAdmin(eventId);
    }
    async getAllUsers() {
        return await this.usersService.getAllUsers();
    }
    async getDetailedUsers() {
        return await this.usersService.getDetailedUsers();
    }
    async getUserById(userId) {
        return await this.usersService.findById(userId);
    }
    async registerUser(user) {
        return await this.usersService.create(user);
    }
    async updateUser(newUser, userId) {
        const { email } = newUser;
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_2.NotFoundException(`User ${userId} does not exist`);
        }
        if (email && email != user.email) {
            await this.sessions.deleteUserSessions(userId);
        }
        return await this.usersService.update(newUser, userId);
    }
    async deleteUser(userId) {
        return await this.usersService.delete(userId);
    }
    async getStudents() {
        return await this.studentsService.getAllStudents();
    }
    async getStudentById(student_id) {
        return await this.studentsService.getStudentById(student_id);
    }
    async updateStudent(updateStudentDto, student_id) {
        return await this.studentsService.updateStudent(updateStudentDto, student_id);
    }
    async createStudent(student) {
        return await this.studentsService.createStudent(student);
    }
    async deleteStudent(student_id) {
        return await this.studentsService.deleteStudent(student_id);
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService,
        users_service_1.UsersService,
        students_service_1.StudentsService,
        sessions_service_1.SessionsService])
], AdminsService);
//# sourceMappingURL=admins.service.js.map