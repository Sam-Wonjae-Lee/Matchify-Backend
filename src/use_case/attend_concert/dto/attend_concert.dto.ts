import { IsInt, IsString } from "class-validator";


export class AttendConcertDto {
    @IsString()
    readonly userID: string;

    @IsString()
    readonly concertID: string;
}