import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockerModule } from './use_case/blocker/blocker.module';
import { DatabaseModule } from './database/database.module';
import { MessageModule } from './use_case/message/message.module';
import { RequestDecisionModule } from './use_case/request_decision/request_decision.module';

@Module({
  imports: [BlockerModule, MessageModule, DatabaseModule, RequestDecisionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
