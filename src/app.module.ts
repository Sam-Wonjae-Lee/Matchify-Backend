import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockerModule } from './use_case/blocker/blocker.module';
import { DatabaseModule } from './database/database.module';
import { MessageModule } from './use_case/message/message.module';

@Module({
  imports: [BlockerModule, MessageModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
