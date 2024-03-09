import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(80)
  @MinLength(3)
  @IsNotEmpty()
  readonly name: string;

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

  @IsString()
  @MaxLength(80)
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@lau\.edu$/, { message: 'Only LAU emails are accepted' })
  readonly email: string;
}
