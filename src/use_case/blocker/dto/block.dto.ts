import { IsInt } from 'class-validator';

export class BlockDto {
  @IsInt()
  readonly user_id: number;

  @IsInt()
  readonly blocked_user_id: number;
}