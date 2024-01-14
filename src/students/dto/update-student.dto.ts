import { IsInt, IsString, Min, Max, Length } from 'class-validator';

export class UpdateStudentDto {
  @IsInt()
  @Min(199000000)
  @Max(999999999)
  student_id: number;

  @IsString()
  @Length(3, 80)
  name: string;
}
