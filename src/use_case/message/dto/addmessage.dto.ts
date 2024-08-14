import { IsInt, IsString } from 'class-validator';

export class AddMessageDto {
  @IsInt()
  messageID: number;

  @IsString()
  userID: string;

  @IsInt()
  threadID: number;

  @IsString()
  content: string;
}