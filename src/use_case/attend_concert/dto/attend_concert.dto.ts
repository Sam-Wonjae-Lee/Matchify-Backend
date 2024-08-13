import { IsInt, IsString } from "class-validator";


export class AttendConcertDto {
    @IsInt()
    readonly userID: number;

    @IsString()
    readonly concertID: string;
}