import { IsInt, IsString } from 'class-validator';

export class GetDirectThreadDto {
    @IsString()
    user1ID: string;

    @IsString()
    user2ID: string;
}