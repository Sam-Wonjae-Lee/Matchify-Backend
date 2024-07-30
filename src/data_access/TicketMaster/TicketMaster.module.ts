import { Module } from '@nestjs/common';
import { TicketMasterController } from './TicketMaster.controller';
import { TicketMasterService } from './TicketMaster.service';
import { DatabaseModule } from 'src/database/database.module';


@Module({
  imports: [DatabaseModule],
  providers: [TicketMasterService,],
  controllers: [TicketMasterController]

})
export class TicketMasterModule {}
