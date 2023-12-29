import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { ClubSchema } from './schemas/club.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Club", schema: ClubSchema }])],
  providers: [ClubsService],
  controllers: [ClubsController],
  exports: [ClubsService, MongooseModule]
})

export class ClubsModule {}
