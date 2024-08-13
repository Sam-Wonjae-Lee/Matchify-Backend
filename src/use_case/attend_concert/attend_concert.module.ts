import { Module } from '@nestjs/common';
import { AttendConcertController } from './attend_concert.controller';
import { AttendConcertService } from './attend_concert.service';
import { DatabaseModule } from 'src/database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [AttendConcertController],
  providers: [AttendConcertService],
})

export class AttendConcertModule {}