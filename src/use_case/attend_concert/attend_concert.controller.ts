import { Controller, Post, Body, Get } from '@nestjs/common';
import { AttendConcertService } from './attend_concert.service';
import { AttendConcertDto } from './dto/attend_concert.dto';

@Controller('attend_concert')
export class AttendConcertController {
    constructor(private readonly attendConcertService: AttendConcertService) {}

    @Post('add_attendee')
    attend_concert(@Body() attendConcertDto: AttendConcertDto) {
        return this.attendConcertService.attend_concert(attendConcertDto);
    }

    @Post("unadd_attendee")
    unattend_concert(@Body() attendConcertDto: AttendConcertDto) {
        return this.attendConcertService.unattend_concert(attendConcertDto);
    }

    @Post('is_attending')
    is_user_attending_concert(@Body() attendConcertDto: AttendConcertDto) {
        return this.attendConcertService.is_user_attending_concert(attendConcertDto.userID, attendConcertDto.concertID);
    }
}
