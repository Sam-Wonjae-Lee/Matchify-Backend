import { IsInt} from 'class-validator';

export class RemoveMessageDto {
  @IsInt()
  messageID: number;
}