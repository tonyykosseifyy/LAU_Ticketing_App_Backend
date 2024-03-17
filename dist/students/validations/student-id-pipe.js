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
exports.StudentIdPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class StudentIdValidation {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(199000000),
    (0, class_validator_1.Max)(999999999),
    __metadata("design:type", Number)
], StudentIdValidation.prototype, "student_id", void 0);
let StudentIdPipe = class StudentIdPipe {
    async transform(value, metadata) {
        if (metadata.type !== 'param') {
            return value;
        }
        const numericValue = parseInt(value, 10);
        if (isNaN(numericValue)) {
            throw new common_1.BadRequestException('Invalid student id: not a number');
        }
        const object = (0, class_transformer_1.plainToInstance)(StudentIdValidation, { student_id: numericValue });
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            throw new common_1.BadRequestException('Validation failed for student id');
        }
        return numericValue;
    }
};
exports.StudentIdPipe = StudentIdPipe;
exports.StudentIdPipe = StudentIdPipe = __decorate([
    (0, common_1.Injectable)()
], StudentIdPipe);
//# sourceMappingURL=student-id-pipe.js.map