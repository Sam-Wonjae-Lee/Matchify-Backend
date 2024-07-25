import { Module } from '@nestjs/common';
import { RequestDecisionController } from './request_decision.controller';
import { RequestDecisionService } from './request_decision.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RequestDecisionController],
  providers: [RequestDecisionService],
})
export class RequestDecisionModule {}
