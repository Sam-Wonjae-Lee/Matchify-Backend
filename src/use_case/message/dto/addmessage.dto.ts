import { IsInt, IsString } from 'class-validator';

export class AddMessageDto {
  @IsInt()
  messageID: number;

  @IsInt()
  userID: number;

  @IsInt()
  threadID: number;

  @IsString()
  content: string;
}