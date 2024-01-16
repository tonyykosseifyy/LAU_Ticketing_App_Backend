import { Module } from '@nestjs/common';
import { ScansController } from './scans.controller';
import { ScansService } from './scans.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScanSchema } from './schemas/scan.schema';
import { StudentsModule } from 'src/students/students.module';
import { EventsModule } from 'src/events/events.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Scan', schema: ScanSchema }]), StudentsModule, EventsModule],
  controllers: [ScansController],
  providers: [ScansService]
})

export class ScansModule {}