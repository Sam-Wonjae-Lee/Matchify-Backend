import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SpotifyModule } from './data_access/spotify.module';

import { BlockerModule } from './use_case/blocker/blocker.module';
import { DatabaseModule } from './database/database.module';
import { MessageModule } from './use_case/message/message.module';
import { FriendRequestModule } from './use_case/friend_request/friend_request.module';
import { RequestDecisionModule } from './use_case/request_decision/request_decision.module';
import { TicketMasterModule } from './data_access/TicketMaster/TicketMaster.module';


@Module({
  imports: [SpotifyModule, BlockerModule, MessageModule, DatabaseModule, FriendRequestModule, RequestDecisionModule, TicketMasterModule],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
