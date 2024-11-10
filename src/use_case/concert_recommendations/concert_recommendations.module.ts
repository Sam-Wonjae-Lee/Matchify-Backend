import { Module } from '@nestjs/common';
import { ConcertRecommendationsController } from './concert_recommendations.controller';
import { ConcertRecommendationsService } from './concert_recommendations.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [ConcertRecommendationsService],
    controllers: [ConcertRecommendationsController]
})

export class ConcertRecommendationsModule {}