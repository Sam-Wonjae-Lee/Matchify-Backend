import { IsInt } from 'class-validator';

export class AddFriendDto {
    @IsInt()
    readonly senderID: number;
    
    @IsInt()
    readonly receiverID: number;
}