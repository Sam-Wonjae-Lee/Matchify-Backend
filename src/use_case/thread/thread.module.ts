import { Module } from '@nestjs/common';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ThreadController],
  providers: [ThreadService]
})
export class ThreadModule {}
