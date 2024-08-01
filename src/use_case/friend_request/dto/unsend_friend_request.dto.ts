import { IsInt } from 'class-validator';

export class UnsendFriendRequestDto {
  @IsInt()
  readonly senderID: number;

  @IsInt()
  readonly receiverID: number;
}
