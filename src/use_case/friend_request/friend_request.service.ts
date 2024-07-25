import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SendFriendRequestDto } from './dto/send_friend_request.dto';

@Injectable()
export class FriendRequestService {
    constructor(private readonly databaseService: DatabaseService) {}

    // adds friend request onto the database
    send_friend_request(sendFriendRequestDto: SendFriendRequestDto) {
        const {senderID, receiverID} = sendFriendRequestDto;
        this.databaseService.send_friend_request(senderID, receiverID);
    }

    // removes friend request from the database
    unsend_friend_request(sendFriendRequestDto: SendFriendRequestDto){
        const {senderID, receiverID} = sendFriendRequestDto;
        this.databaseService.unsend_friend_request(senderID, receiverID);
    }

}