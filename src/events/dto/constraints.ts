import { 
    ValidatorConstraint, 
    ValidatorConstraintInterface, ValidationArguments,
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