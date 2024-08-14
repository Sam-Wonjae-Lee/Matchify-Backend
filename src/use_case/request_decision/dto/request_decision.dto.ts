import { IsInt } from 'class-validator';

export class RequestDecisionDto {
  @IsInt()
  readonly receiver_id: string;

  @IsInt()
  readonly sender_id: string;
}
