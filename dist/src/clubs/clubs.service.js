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
exports.ClubsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
let ClubsService = class ClubsService {
    constructor(clubModel) {
        this.clubModel = clubModel;
    }
    async getClubs() {
        return await this.clubModel.find();
    }
    async create(club) {
        const oldClub = await this.clubModel.findOne({ name: { $regex: club.name, $options: 'i' } });
        if (oldClub) {
            throw new common_1.NotFoundException(`Club ${club.name} already exists`);
        }
        const hashedPassword = await bcrypt.hash(club.password, 10);
        club.password = hashedPassword;
        const newClub = new this.clubModel(club);
        try {
            await newClub.save();
        }
        catch (err) {
            if (err.code === 11000) {
                throw new common_1.BadRequestException('Email should be unique for a given Club');
            }
            throw new common_1.BadRequestException('Could not create club');
        }
        return newClub;
    }
    async delete(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const club = await this.clubModel.findById(id);
        if (!club) {
            throw new common_1.NotFoundException(`Club with ID ${id} not found`);
        }
        await this.clubModel.deleteOne({ _id: id });
        return club;
    }
    async getClub(name) {
        return await this.clubModel.findOne({ name: { $regex: name, $options: 'i' } });
    }
    async findById(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const club = await this.clubModel.findById(id);
        if (!club) {
            return null;
        }
        return club;
    }
};
exports.ClubsService = ClubsService;
exports.ClubsService = ClubsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Club')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClubsService);
//# sourceMappingURL=clubs.service.js.map