import { IsInt } from 'class-validator';

export class UnblockDto {
  @IsInt()
  readonly user_id: number;

  @IsInt()
  readonly unblocked_user_id: number;
}