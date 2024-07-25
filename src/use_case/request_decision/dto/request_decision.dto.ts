import { IsInt } from 'class-validator';

export class RequestDecisionDto {
  @IsInt()
  readonly receiver_id: number;

  @IsInt()
  readonly sender_id: number;
}
