import { IsInt } from 'class-validator';

export class GetMessagesDto {
  @IsInt()
  threadID: number;
}