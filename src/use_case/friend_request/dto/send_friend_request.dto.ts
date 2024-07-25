import { IsInt } from 'class-validator';

export class SendFriendRequestDto {
    @IsInt()
    readonly senderID: number;
    
    @IsInt()
    readonly receiverID: number;
}