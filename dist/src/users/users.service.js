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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const events_service_1 = require("../events/events.service");
let UsersService = class UsersService {
    constructor(userModel, eventsService) {
        this.userModel = userModel;
        this.eventsService = eventsService;
    }
    async getAllUsers() {
        return await this.userModel.find({ role: 'user' }).sort({ name: 1 });
    }
    async getDetailedUsers() {
        const users = await this.userModel.find().sort({ name: 1 }).lean();
        users.forEach(async (user) => {
            user.numberOfEvents = user.events.length;
        });
        return users;
    }
    async create(user) {
        const oldUser = await this.userModel.findOne({ name: { $regex: user.name, $options: 'i' } });
        if (oldUser) {
            throw new common_1.NotFoundException(`User ${user.name} already exists`);
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        const newUser = new this.userModel(user);
        try {
            await newUser.save();
        }
        catch (err) {
            if (err.code === 11000) {
                throw new common_1.BadRequestException('Email should be unique for a given Club');
            }
            throw new common_1.BadRequestException('Could not create user');
        }
        return newUser;
    }
    async update(newUser, user_id) {
        const newUserv2 = {
            ...newUser,
            verified: false
        };
        if (!(0, mongoose_2.isValidObjectId)(user_id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const options = { new: true };
        const modifiedUser = await this.userModel.findOneAndUpdate({ _id: user_id }, newUserv2, options);
        if (!modifiedUser) {
            throw new common_1.NotFoundException(`User with ID ${user_id} not found`);
        }
        return modifiedUser;
    }
    async delete(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`Club with ID ${id} not found`);
        }
        await this.eventsService.deleteMultipleEvents(user.events);
        await this.userModel.deleteOne({ _id: id });
        return user;
    }
    async getUser(name) {
        return await this.userModel.findOne({ name: { $regex: name, $options: 'i' } });
    }
    async findById(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            return null;
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        events_service_1.EventsService])
], UsersService);
//# sourceMappingURL=users.service.js.map