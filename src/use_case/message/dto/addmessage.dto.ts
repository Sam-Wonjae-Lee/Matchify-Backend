import { IsInt, IsString } from 'class-validator';

export class AddMessageDto {
  @IsString()
  user_id: string;

  @IsInt()
  thread_id: number;

  @IsString()
  content: string;
}