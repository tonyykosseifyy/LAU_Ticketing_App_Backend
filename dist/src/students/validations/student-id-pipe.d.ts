import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class StudentIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
}
