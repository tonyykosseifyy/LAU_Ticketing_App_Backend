"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFutureDate = exports.IsFutureDateConstraint = exports.IsBeforeConstraint = void 0;
const class_validator_1 = require("class-validator");
let IsBeforeConstraint = class IsBeforeConstraint {
    validate(endDate, args) {
        const [relatedPropertyName] = args.constraints;
        const startDate = args.object[relatedPropertyName];
        return startDate instanceof Date && endDate instanceof Date && startDate < endDate;
    }
    defaultMessage(args) {
        return `"${args.property}" should be after "${args.constraints[0]}"`;
    }
};
exports.IsBeforeConstraint = IsBeforeConstraint;
exports.IsBeforeConstraint = IsBeforeConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsBefore', async: false })
], IsBeforeConstraint);
let IsFutureDateConstraint = class IsFutureDateConstraint {
    validate(date, args) {
        return date > new Date();
    }
    defaultMessage(args) {
        return 'Date must be in the future';
    }
};
exports.IsFutureDateConstraint = IsFutureDateConstraint;
exports.IsFutureDateConstraint = IsFutureDateConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], IsFutureDateConstraint);
function IsFutureDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsFutureDateConstraint,
        });
    };
}
exports.IsFutureDate = IsFutureDate;
//# sourceMappingURL=constraints.js.map