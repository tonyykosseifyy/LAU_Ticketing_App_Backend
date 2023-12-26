import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  IsOptional
} from 'class-validator';

export class CreateClubDto {
  @IsString()
  @MaxLength(80)
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

  @IsOptional()
  @IsString()
  @MaxLength(80)
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@lau\.edu$/, { message: 'Email must end with @lau.edu' })
  readonly email: string;
}
