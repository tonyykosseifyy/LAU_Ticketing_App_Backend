// name: string, password: string, code: string
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
  Length,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MaxLength(80)
  @MinLength(3)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MaxLength(80)
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@lau\.edu$/, { message: 'Only LAU emails are accepted' })
  readonly email: string;

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
  readonly password: string;
}
