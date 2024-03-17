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
exports.CreateEventDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const constraints_1 = require("./constraints");
class CreateEventDto {
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 200, { message: 'Name must be between 3 and 200 characters long' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 5000, { message: 'Description must be between 3 and 5000 characters long' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['barcode', 'qrcode'], { message: 'Scan type must be either "barcode" or "qrcode"' }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "scan_type", void 0);
__decorate([
    (0, class_validator_1.IsDate)({ message: 'Start date must be a valid date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, constraints_1.IsFutureDate)({ message: 'Start date must be in the future' }),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsDate)({ message: 'End date must be a valid date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.Validate)(constraints_1.IsBeforeConstraint, ['start_date']),
    __metadata("design:type", Date)
], CreateEventDto.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true, message: 'Each club ID must be a valid MongoDB ObjectId' }),
    __metadata("design:type", Array)
], CreateEventDto.prototype, "users", void 0);
//# sourceMappingURL=create-event.dto.js.map