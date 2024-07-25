import { Injectable } from '@nestjs/common';
import { RequestDecisionDto } from './dto/request_decision.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RequestDecisionService {
  constructor(private readonly databaseService: DatabaseService) {}

  // add sender_id to receiver_id's friend list and remove it from inbox
  accept(requestDecisionDto: RequestDecisionDto) {
    const { receiver_id, sender_id } = requestDecisionDto;
    this.databaseService.acceptFriendRequest(receiver_id, sender_id);
  }

  // removes sender_id from receiver_id's inbox
  decline(requestDecisionDto: RequestDecisionDto) {
    const { receiver_id, sender_id } = requestDecisionDto;
    this.databaseService.declineFriendRequest(receiver_id, sender_id);
  }
}
