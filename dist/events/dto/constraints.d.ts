import { ValidatorConstraintInterface, ValidationArguments, ValidationOptions } from 'class-validator';
export declare class IsBeforeConstraint implements ValidatorConstraintInterface {
    validate(endDate: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class IsFutureDateConstraint implements ValidatorConstraintInterface {
    validate(date: Date, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function IsFutureDate(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
