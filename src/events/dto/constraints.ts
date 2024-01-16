import { 
    ValidatorConstraint, 
    ValidatorConstraintInterface, ValidationArguments,
    ValidationOptions, registerDecorator
} from 'class-validator';

@ValidatorConstraint({ name: 'IsBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
    validate(endDate: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const startDate = (args.object as any)[relatedPropertyName];
        return startDate instanceof Date && endDate instanceof Date && startDate < endDate;
    }

    defaultMessage(args: ValidationArguments) {
        return `"${args.property}" should be after "${args.constraints[0]}"`;
    }
}

@ValidatorConstraint({ async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
    validate(date: Date, args: ValidationArguments) {
        return date > new Date();
    }

    defaultMessage(args: ValidationArguments) {
        return 'Date must be in the future';
    }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsFutureDateConstraint,
        });
    };
}
