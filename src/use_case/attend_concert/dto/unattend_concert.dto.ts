import { IsInt, IsString } from "class-validator";


export class UnAttendConcertDto {
    @IsInt()
    readonly userID: number;

    @IsString()
    readonly concertID: string;
}