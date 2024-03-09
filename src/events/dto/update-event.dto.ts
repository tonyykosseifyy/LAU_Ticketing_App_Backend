import { 
    IsString, Length, IsEnum, IsDate, Validate, IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsBeforeConstraint, IsFutureDate } from './constraints';


export class UpdateEventDto {
    @IsOptional()
    @IsString()
    @Length(3, 200, { message: 'Name must be between 3 and 200 characters long' })
    name: string;

    @IsOptional()
    @IsString()
    @Length(3, 5000, { message: 'Description must be between 3 and 5000 characters long' })
    description: string;

    @IsOptional()
    @IsDate({ message: 'Start date must be a valid date' })
    @Type(() => Date)
    @IsFutureDate({ message: 'Start date must be in the future' })
    start_date: Date;

    @IsOptional()
    @IsDate({ message: 'End date must be a valid date' })
    @Type(() => Date)
    @Validate(IsBeforeConstraint, ['start_date'])
    end_date: Date;
}
