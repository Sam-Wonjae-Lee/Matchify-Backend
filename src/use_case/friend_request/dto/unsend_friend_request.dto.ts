import { IsString } from 'class-validator';

export class UnsendFriendRequestDto {
  @IsString()
  readonly senderID: string;

  @IsString()
  readonly receiverID: string;
}
