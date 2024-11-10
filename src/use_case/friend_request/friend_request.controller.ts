import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { SendFriendRequestDto } from './dto/send_friend_request.dto';
import { UnsendFriendRequestDto } from './dto/unsend_friend_request.dto';


@Controller('friend_request')
export class FriendRequestController {
    constructor(private readonly friendRequestService: FriendRequestService) {}

    @Post('/send_friend_request')
    send_friend_request(@Body() sendFriendRequestDto: SendFriendRequestDto) {
        return this.friendRequestService.send_friend_request(sendFriendRequestDto);
    }

    @Post('/unsend_friend_request')
    unsend_friend_request(@Body() unsendFriendRequestDto: UnsendFriendRequestDto) {
        return this.friendRequestService.unsend_friend_request(unsendFriendRequestDto);
    }

    @Post('/get_user_friend_requests')
    get_user_friend_requests(@Body('receiverID') receiverID) {
        return this.friendRequestService.get_user_friend_requests(receiverID);
    }
}

