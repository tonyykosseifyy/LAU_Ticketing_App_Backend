import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    Matches,
    IsEmail
} from 'class-validator';

export class ForgotPasswordReqDto {
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
}
