import { Controller, Get, Body, Post} from '@nestjs/common';
import { ConcertSearchingDto } from './dto/concert_searching.dto';
import { ConcertSearchingService } from './concert_searching.service';


@Controller('search_concerts')
export class ConcertSearchingController {
    constructor(private readonly concertSearchingService: ConcertSearchingService) {}

    @Post()
    search_concerts(@Body() concertSearchingDto: ConcertSearchingDto) {
        return this.concertSearchingService.search_concerts(concertSearchingDto)
    }
}

