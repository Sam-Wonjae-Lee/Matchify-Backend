import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockerModule } from './use_case/blocker/blocker.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [BlockerModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
