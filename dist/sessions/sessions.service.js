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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_service_1 = require("../users/users.service");
const mongodb_1 = require("mongodb");
let SessionsService = class SessionsService {
    constructor(sessionModel, usersService) {
        this.sessionModel = sessionModel;
        this.usersService = usersService;
    }
    async attachUser(session_id, user_id) {
        if (!(0, mongoose_2.isValidObjectId)(user_id)) {
            throw new common_1.BadRequestException('Invalid User id format');
        }
        const session = await this.sessionModel.findOne({ _id: session_id });
        if (!session) {
            throw new common_1.NotFoundException("Session not Found");
        }
        const user = await this.usersService.findById(user_id);
        if (!user) {
            throw new common_1.NotFoundException("User not Found");
        }
        try {
            session.user_id = user_id;
            await session.save();
            return session;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async deleteUserSessions(user_id) {
        if (!(0, mongoose_2.isValidObjectId)(user_id)) {
            throw new common_1.BadRequestException('Invalid User id format');
        }
        try {
            await this.sessionModel.deleteMany({ user_id: new mongodb_1.ObjectId(user_id) });
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Session')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map