import { Module, forwardRef } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './schemas/student.schema';
import { ScansModule } from 'src/scans/scans.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),forwardRef(() => ScansModule)],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService, MongooseModule]
})
export class StudentsModule {}
