import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockerModule } from './use_case/blocker/blocker.module';
import { DatabaseModule } from './database/database.module';
import { MessageModule } from './use_case/message/message.module';
import { FriendRequestModule } from './use_case/friend_request/friend_request.module';

@Module({
  imports: [BlockerModule, MessageModule, DatabaseModule, FriendRequestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
