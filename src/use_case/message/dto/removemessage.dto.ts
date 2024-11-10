import { IsInt} from 'class-validator';

export class RemoveMessageDto {
  @IsInt()
  message_id: number;
}