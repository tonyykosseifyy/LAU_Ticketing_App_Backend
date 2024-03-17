import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class IsValidMongoIdPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string;
}
