import {
    IsNotEmpty,
    IsString,
    MaxLength,
    Length,
    MinLength,
    Matches
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

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(16, { message: 'Password must be no longer than 16 characters' })
    @Matches(/(?=.*[a-zA-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least one letter and one number',
    })
    @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character (!@#$%^&*)',
    })
    @IsNotEmpty()
    password: string;

}
