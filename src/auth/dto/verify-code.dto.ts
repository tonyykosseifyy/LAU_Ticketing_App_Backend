import {
    IsNotEmpty,
    IsString,
    MaxLength,
    Length,
    MinLength
} from 'class-validator';

export class VerifyDto {
    @IsString()
    @MaxLength(80)
    @MinLength(3)
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @Length(6)
    readonly code: string;
}
