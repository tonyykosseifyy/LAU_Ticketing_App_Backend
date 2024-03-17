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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const scans_service_1 = require("../scans/scans.service");
let StudentsService = class StudentsService {
    constructor(studentModel, scans) {
        this.studentModel = studentModel;
        this.scans = scans;
    }
    async getAllStudents() {
        const students = await this.studentModel.find().sort({ name: 1 });
        return students;
    }
    async getStudentById(student_id) {
        const student = await this.studentModel.findOne({ student_id }).lean();
        const scans = await this.scans.getStudentEvents(student._id);
        let detailedStudent = {
            ...student,
            scans: scans,
            attendedEvents: scans.length
        };
        return detailedStudent;
    }
    async updateStudent(updateStudentDto, student_id) {
        const { name } = updateStudentDto;
        const student = await this.studentModel.findOneAndUpdate({ student_id }, { name }, { new: true });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID: ${student_id} does not exist.`);
        }
        return student;
    }
    async createStudent(student) {
        const { student_id } = student;
        const studentExist = await this.studentModel.findOne({ student_id });
        if (studentExist) {
            throw new common_1.NotFoundException(`Student with ID: ${student_id} already exists.`);
        }
        const newStudent = new this.studentModel(student);
        return await newStudent.save();
    }
    async deleteStudent(student_id) {
        await this.scans.deleteStudentScans(student_id);
        const deleted_student = await this.studentModel.findOneAndDelete({ student_id });
        if (!deleted_student) {
            throw new common_1.NotFoundException(`Student with ID: ${student_id} does not exist.`);
        }
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Student')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        scans_service_1.ScansService])
], StudentsService);
//# sourceMappingURL=students.service.js.map