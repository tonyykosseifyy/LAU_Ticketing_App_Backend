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
exports.ScanEventDto = void 0;
const class_validator_1 = require("class-validator");
class ScanEventDto {
}
exports.ScanEventDto = ScanEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 200, { message: 'Name must be between 3 and 200 characters long' }),
    __metadata("design:type", String)
], ScanEventDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(199000000, { message: 'student_id must be greater than or equal to 199000000' }),
    (0, class_validator_1.Max)(999999999, { message: 'student_id must be less than or equal to 999999999' }),
    __metadata("design:type", Number)
], ScanEventDto.prototype, "student_id", void 0);
//# sourceMappingURL=scan-event.dto.js.map