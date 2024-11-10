import { IsInt, IsString } from 'class-validator';

export class AddMessageDto {
  @IsInt()
  message_id: number;

  @IsString()
  user_id: string;

  @IsInt()
  thread_id: number;

  @IsString()
  content: string;
}