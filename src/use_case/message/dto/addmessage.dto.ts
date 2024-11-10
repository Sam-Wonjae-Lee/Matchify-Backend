import { IsInt, IsString } from 'class-validator';

export class AddMessageDto {

  @IsString()
  userID: string;

  @IsInt()
  threadID: number;

  @IsString()
  content: string;
}