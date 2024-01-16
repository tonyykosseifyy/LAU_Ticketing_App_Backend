import { IsString, Length, IsOptional, IsInt, Min, Max } from 'class-validator';

export class ScanEventDto {
    @IsString()
    @IsOptional()
    @Length(3, 200, { message: 'Name must be between 3 and 200 characters long' })
    readonly name?: string; 
    
    @IsInt()
    @Min(199000000, { message: 'student_id must be greater than or equal to 199000000' })
    @Max(999999999, { message: 'student_id must be less than or equal to 999999999' })
    readonly student_id: number;
}
