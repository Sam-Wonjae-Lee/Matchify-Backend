import { IsInt, IsString } from 'class-validator';

export class AddThreadDto {
    @IsInt()
    threadID: number;

    @IsString()
    threadName: string;
}