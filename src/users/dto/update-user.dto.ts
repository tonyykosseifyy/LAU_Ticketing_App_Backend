import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    IsEmail,
    IsOptional,
  } from 'class-validator';
  
  export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(80)
    @MinLength(3)
    @IsNotEmpty()
    readonly name: string;
    
    @IsOptional()
    @IsString()
    @MaxLength(80)
    @IsEmail({}, { message: 'Invalid email format' })
    // temporary for testing
    // @Matches(/@lau\.edu$/, { message: 'Only LAU emails are accepted' })
    readonly email: string;
}
  