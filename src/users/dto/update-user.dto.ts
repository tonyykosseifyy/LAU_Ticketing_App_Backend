import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    IsEmail,
  } from 'class-validator';
  
  export class UpdateUserDto {
    @IsString()
    @MaxLength(80)
    @MinLength(3)
    @IsNotEmpty()
    readonly name: string;
  
    @IsString()
    @MaxLength(80)
    @IsEmail({}, { message: 'Invalid email format' })
    // temporary for testing
    // @Matches(/@lau\.edu$/, { message: 'Only LAU emails are accepted' })
    readonly email: string;
}
  