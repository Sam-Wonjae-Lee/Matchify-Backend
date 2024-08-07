import { IsInt} from 'class-validator';

export class RemoveThreadDto {
  @IsInt()
  threadID: number;
}