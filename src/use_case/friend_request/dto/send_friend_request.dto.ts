import {IsString } from 'class-validator';

export class SendFriendRequestDto {
    @IsString()
    readonly senderID: string;
    
    @IsString()
    readonly receiverID: string;
}