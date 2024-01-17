import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, IsInt, Min, Max } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class StudentIdValidation {
  @IsInt()
  @Min(199000000)
  @Max(999999999)
  student_id: number;
}

@Injectable()
export class StudentIdPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value;
    }

    // Try to convert the value to a number
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) {
      throw new BadRequestException('Invalid student id: not a number');
    }

    const object = plainToInstance(StudentIdValidation, { student_id: numericValue });
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed for student id');
    }

    return numericValue;
  }
}
