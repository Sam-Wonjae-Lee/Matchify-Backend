import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ConcertSearchingController } from './concert_searching.controller';
import { ConcertSearchingService } from './concert_searching.service';

@Module ({
    imports: [DatabaseModule],
    controllers: [ConcertSearchingController],
    providers: [ConcertSearchingService],
})

export class ConcertSearchingModule {}