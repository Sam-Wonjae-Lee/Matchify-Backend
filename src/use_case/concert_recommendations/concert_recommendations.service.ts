import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ConcertRecommendationsDto } from './dto/concert_recommendations.dto';

@Injectable()
export class ConcertRecommendationsService {
    constructor(private databaseService: DatabaseService) {}

    public async get_concert_recommendations(concertRecommendationsDto: ConcertRecommendationsDto): Promise<any> {
        // Preconditions: userID must be a valid user ID, fav_artist must be a valid artist name.
        // Postconditions: Returns a list of concerts that the user might enjoy based on their favorite artist.
        // Invariants: The list of concerts must be sorted by date, with the most recent concerts first.

        // Get a list of upcoming concerts for the user's favorite artist
        // The rest of the concerts we recommend will be based on th size of the concerts

        const {userID} = concertRecommendationsDto;

        const concerts = await this.databaseService.get_concerts(userID);
        console.log(concerts);
        return concerts;
    }
}