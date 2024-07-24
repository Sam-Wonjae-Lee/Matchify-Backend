import { IsInt } from 'class-validator';

export class AddFriendDto {
    @IsInt()
    readonly userID: number;
    
    @IsInt()
    readonly friendID: number;
}