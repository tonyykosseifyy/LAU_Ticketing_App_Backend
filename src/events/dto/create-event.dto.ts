import { 
    IsString, Length, IsEnum, IsDate, 
    IsArray, IsMongoId, Validate, IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsBeforeConstraint, IsFutureDate } from './constraints';



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
    @IsFutureDate({ message: 'Start date must be in the future' })
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
