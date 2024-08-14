import { IsInt, IsString } from 'class-validator';

export class BlockDto {
  @IsString()
  readonly user_id: string;

  @IsString()
  readonly blocked_user_id: string;
}