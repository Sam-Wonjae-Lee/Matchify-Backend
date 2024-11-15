import { Injectable } from '@nestjs/common';
import { populate } from 'dotenv';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TicketMasterService {
    private apiKey: string;

    constructor(private databaseService: DatabaseService) {
        this.apiKey = process.env.TICKETMASTER_API_KEY;
    }

    // Get a list of upcoming concerts in a given country
    public async update_with_upcoming_concerts(time_range_start: string, time_range_end: string): Promise<any> {
        // Preconditions: country must be a valid country code, time_range_start and time_range_end must be ISO 8601 format.

        const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
        // the URLSearchParams object is used to create a query string
        const params = new URLSearchParams({
            apikey: this.apiKey,
            // countryCode: country,
            classificationName: 'music',
            startDateTime: time_range_start,
            endDateTime: time_range_end,
            size: '200'  // Adjust the size to get more or fewer events per request
        });


        const response = await fetch(`${url}?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Failed to retrieve info: ${response.status}`);
        }

        const data = await response.json();

        if (data._embedded) {
            interface Event {
                id: string;
                name: string;
                dates: {
                    start: {
                        localDate: string;
                    };
                };
                _embedded: {
                    venues: {
                        name: string;
                        city: {
                            name: string;
                        };
                    }[];
                    promoters?: {
                        name: string;
                    }[];
                    attractions?: {
                        name: string;
                    }[];
                };
                classifications: {
                    genre: {
                        name: string;
                    };
                    subGenre: {
                        name: string;
                    };
                }[];
                url: string;
                images: {
                    ratio: string;
                    url: string;
                }[];
                rank?: number; // Add rank property
            }
        
            interface ApiResponse {
                _embedded: {
                    events: Event[];
                };
            }

            // Assign ranks to events
            data._embedded.events.forEach((event: Event, index: number) => {
                event.rank = index + 1;
            });

            // saving the eevents info into a variable
        
            const events = (data as ApiResponse)._embedded.events.map((event) => ({
                concert_id: event.id,
                name: event.name,
                url: event.url,
                location: event._embedded.venues?.[0]?.city?.name || 'Unknown City',
                venue: event._embedded.venues?.[0]?.name || 'Unknown Venue',
                date: event.dates.start.localDate,
                image: event.images.find((image) => image.ratio === '16_9')?.url || 'No Image Available',
                promoter: event._embedded.promoters?.[0]?.name || 'Unknown Promoter',
                performers: event._embedded.attractions ? event._embedded.attractions.map(attraction => attraction.name).join(', ') : 'Unknown Performers',
                genre: event.classifications?.[0]?.genre?.name || 'Unknown Genre',
                subGenre: event.classifications?.[0]?.subGenre?.name || 'Unknown SubGenre',
                popularity_rank: event.rank
            }));

            const uniqueEvents = [];
            const eventNames = new Set();

            events.forEach(event => {
                if (!eventNames.has(event.name)) {
                    uniqueEvents.push(event);
                    eventNames.add(event.name);
                }
            });

            // Add upcoming concerts to the database
            this.databaseService._delete_all_concerts();
            this.databaseService.update_concerts(uniqueEvents);

            return uniqueEvents.map((event) => ({
                id: event.concert_id,
                name: event.name,
                date: event.date,
                venue: event.venue,
                url: event.url,
                image: event.image,
                city: event.location,
                promoter: event.promoter,
                performers: event.performers,
                genre: event.genre,
                subGenre: event.subGenre
            }));

        } else {
            throw new Error('No events found.');
        }
    }
}