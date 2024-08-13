import { Controller, Post, Body } from '@nestjs/common';
import { AttendConcertService } from './attend_concert.service';
import { AttendConcertDto } from './dto/attend_concert.dto';

@Controller('attend_concert')
export class AttendConcertController {
    constructor(private readonly attendConcertService: AttendConcertService) {}

    @Post()
    attend_concert(@Body() attendConcertDto: AttendConcertDto) {
        return this.attendConcertService.attend_concert(attendConcertDto);
    }

    @Post()
    unattend_concert(@Body() attendConcertDto: AttendConcertDto) {
        return this.attendConcertService.unattend_concert(attendConcertDto);
    }

    @Post()
    is_user_attending_concert(@Body() attendConcertDto: AttendConcertDto) {
        return this.attendConcertService.is_user_attending_concert(attendConcertDto.userID, attendConcertDto.concertID);
    }
}
