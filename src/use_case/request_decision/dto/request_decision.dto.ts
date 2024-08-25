import { IsString } from 'class-validator';

export class RequestDecisionDto {
  @IsString()
  readonly receiver_id: string;

  @IsString()
  readonly sender_id: string;
}
