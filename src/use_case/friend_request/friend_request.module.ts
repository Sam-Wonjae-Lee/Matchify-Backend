import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend_request.controller';
import { FriendRequestService } from './friend_request.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestModule {}
