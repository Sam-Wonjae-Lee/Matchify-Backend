import { IsInt, IsString } from 'class-validator';

export class UnblockDto {
  @IsString()
  readonly user_id: string;

  @IsString()
  readonly unblocked_user_id: string;
}