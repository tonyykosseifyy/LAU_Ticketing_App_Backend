import { 
    IsNotEmpty, IsString, Length, IsEnum, IsDate, 
    IsArray, IsMongoId, Validate, ValidatorConstraint, 
    ValidatorConstraintInterface, ValidationArguments,
    IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';


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

export class CreateEventDto {

    @IsString()
    @Length(3, 200, { message: 'Name must be between 3 and 200 characters long' })
    readonly name: string;

    @IsString()
    @Length(3, 5000, { message: 'Description must be between 3 and 5000 characters long' })
    readonly description: string;

    @IsOptional()
    @IsEnum(['barcode', 'qrcode'], { message: 'Scan type must be either "barcode" or "qrcode"' })
    readonly scan_type?: string;

    @IsDate({ message: 'Start date must be a valid date' })
    @Type(() => Date)
    readonly start_date: Date;


    @IsDate({ message: 'End date must be a valid date' })
    @Type(() => Date)
    @Validate(IsBeforeConstraint, ['start_date'])
    readonly end_date: Date;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true, message: 'Each club ID must be a valid MongoDB ObjectId' })
    clubs?: string[]; 
}
