import { ConcertRecommendationsService } from './concert_recommendations.service';
import { Controller, Post, Body } from '@nestjs/common';


@Controller('concert_recommendations')
export class ConcertRecommendationsController {
  constructor(private readonly concertRecommendationsService: ConcertRecommendationsService) {}

    @Post()
    async getConcertRecommendations(@Body() concertRecommendationsDto) {
        return this.concertRecommendationsService.get_concert_recommendations(concertRecommendationsDto);
    }

//   @Get()
//   async getConcertRecommendations(@Body() concertRecommendationsDto) {
//     return this.concertRecommendationsService.get_concert_recommendations(concertRecommendationsDto);
//   }
}
