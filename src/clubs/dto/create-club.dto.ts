import {
  IsNotEmpty,
  IsString,
  MaxLength,
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
  @MaxLength(80)
  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@lau\.edu$/, { message: 'Invalid email format' })
  readonly email: string;
}
