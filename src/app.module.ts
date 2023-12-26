import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './student/schemas/student.schema';
import { StudentController } from './student/student.controller';
import { StudentService } from './student/student.service';
import { ConfigModule } from '@nestjs/config';
import { ClubsModule } from './clubs/clubs.module';


@Module({
  controllers: [AppController, StudentController],
  providers: [AppService, StudentService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.0gnozrq.mongodb.net/?retryWrites=true&w=majority`,{dbName: 'LAU_EVENTS'}),
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    ClubsModule 
  ],
})

export class AppModule {}
