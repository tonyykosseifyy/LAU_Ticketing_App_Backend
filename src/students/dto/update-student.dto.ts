import { IsString, Length } from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  @Length(3, 80)
  name: string;
}
