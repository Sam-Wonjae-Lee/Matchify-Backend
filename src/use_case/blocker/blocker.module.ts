import { Module } from '@nestjs/common';
import { BlockerController } from './blocker.controller';
import { BlockerService } from './blocker.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BlockerController],
  providers: [BlockerService]
})
export class BlockerModule {}
