import { Controller, Get, Param } from '@nestjs/common';
import { TicketMasterService } from './TicketMaster.service';


@Controller('ticketmaster')
export class TicketMasterController {
  constructor(private readonly ticketmasterService: TicketMasterService) {}

  @Get('new_concerts/:country/:time_range_start/:time_range_end')
  async getConcerts(@Param('country') country: string, @Param('time_range_start') time_range_start: string, @Param('time_range_end') time_range_end: string) {
    return this.ticketmasterService.get_upcoming_concerts(time_range_start, time_range_end);
  }

}