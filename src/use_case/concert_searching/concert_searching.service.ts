import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ConcertSearchingDto } from './dto/concert_searching.dto';



@Injectable()
export class ConcertSearchingService {
    constructor(private readonly databaseService: DatabaseService) {}


    // get concerts
    search_concerts(concertSearchingDto: ConcertSearchingDto) {
        const {
            performers,
            concert_name,
            genres,
            date_range_start,
            date_range_end,
            cities,
        } = concertSearchingDto;

        // get concerts from the database
        const list_of_concerts = this.databaseService.search_concert(concert_name);
        
        return list_of_concerts;
    }
}