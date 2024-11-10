import { Controller, Get, Query, Logger, Body, Post } from '@nestjs/common';
import { ConcertSearchingService } from './concert_searching.service';

@Controller('search_concerts')
export class ConcertSearchingController {
    private readonly logger = new Logger(ConcertSearchingController.name);

    constructor(private readonly concertSearchingService: ConcertSearchingService) {
        this.logger.log('ConcertSearchingController initialized');
    }

    @Get()
    search_concerts(@Query() query: any) {
        this.logger.log(`Received query: ${JSON.stringify(query)}`);
        return this.concertSearchingService.search_concerts(query);
    }
}

