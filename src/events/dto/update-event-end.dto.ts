import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventEndDto {
    @IsDate({ message: 'End date must be a valid date' })
    @Type(() => Date)
    readonly end_date: Date;
}
