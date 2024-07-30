import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

// TODO: still has work to do

@Injectable()
export class TicketMasterService {
    private apiKey: string;

    constructor(private databaseService: DatabaseService) {
        this.apiKey = process.env.TICKETMASTER_API_KEY;
    }

    // Get a list of upcoming concerts in a given country
    public async get_upcoming_concerts(country: string, time_range_start: string, time_range_end: string): Promise<any> {
        // Precondition``s: country must be a valid country code, time_range_start and time_range_end must be ISO 8601 format.

        const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
        const params = new URLSearchParams({
            apikey: this.apiKey,
            // make sure to use the correct country code
            // also lets only use 'US' for now
            countryCode: country,
            classificationName: 'music',
            startDateTime: time_range_start,
            endDateTime: time_range_end,
            size: '5'  // Adjust the size to get more or fewer events per request
        });

        const response = await fetch(`${url}?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Failed to retrieve info: ${response.status}`);
        }

        const data = await response.json();

        if (data._embedded) {
            interface Event {
            id: string;  // Add the id property

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
            };
            url: string;
            images: {
                ratio: string;
                url: string;
            }[];
        }
        
        interface ApiResponse {
            _embedded: {
                events: Event[];
            };
        }
        
        const x = (data as ApiResponse)._embedded.events.map((event) => ({
            concert_id: event.id,  // Include the id in the returned object
            name: event.name,
            url: event.url,
            location: event._embedded.venues[0]?.city.name || 'Unknown City',
            venue: event._embedded.venues[0]?.name || 'Unknown Venue',
            date: event.dates.start.localDate,
            image: event.images.find((image) => image.ratio === '16_9')?.url || 'No Image Available',
        }))


        // add upcoming concerts to the database
        this.databaseService.update_concerts(x);

        return (data as ApiResponse)._embedded.events.map((event) => ({
            id: event.id,  // Include the id in the returned object
            name: event.name,
            date: event.dates.start.localDate,
            venue: event._embedded.venues[0]?.name || 'Unknown Venue',
            url: event.url,
            image: event.images.find((image) => image.ratio === '16_9')?.url || 'No Image Available',
            city: event._embedded.venues[0]?.city.name || 'Unknown City',
        }));

        } else {
            throw new Error('No events found.');
        }

    }}
